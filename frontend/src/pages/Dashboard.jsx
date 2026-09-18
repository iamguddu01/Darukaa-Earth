import React, { useCallback, useEffect, useState } from 'react'
import Map from 'react-map-gl/mapbox'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import apiClient from '../api/client';
import DrawControl from '../components/DrawControl'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

function Dashboard() {
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedSite, setSelectedSite] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [newProjectName, setNewProjectName] = useState("")
    const [newProjectDesc, setNewProjectDesc] = useState("")

    useEffect(()=>{
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try{
            const res = await apiClient.get("/projects")
            setProjects(res.data)
            if(res.data.length > 0 && !selectedProject){
                selectedProject(res.data[0])
            }
        } catch (err){
            console.error(err)
        }
    }

    const handleCreateProject = async (e) => {
        e.preventDefault()
        try{
            const res = await apiClient.post("/projects", {
                name: newProjectName,
                description: newProjectDesc
            })
            setProjects([...projects, res.data])
            setSelectedProject(res.data)
            setShowModal(false)
            setNewProjectName('')
            setNewProjectDesc('')
        }catch(err){
            console.error(err)
        }
    }

    const onDrawCreate = useCallback(async (e) => {
        console.log("Draw created:", e)
        if(!selectedProject){
            alert("Please select a project first or create.")
            return
        }
        const polygon = e.features[0].geometry
        try{
            await apiClient.post("/sites", {
                name: "New Site",
                project_id: selectedProject.id,
                geojson_polygon: polygon
            })
            alert("Site successfully saved to PostGIS.")
        }catch(err){
            console.error(err)
            alert("Failed to save site.")
        }
    },[selectedProject])

    const onDrawSelectionChange = useCallback((e)=> {
        if(e.features && e.features.length > 0){
            setSelectedSite(e.features[0])
        }else{
            setSelectedSite(null)
        }
    },[])

    const charData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
            label: 'Carbon offset (Tons)',
            data: [65,76,69,34,67,34],
            backgroundColor: 'rgba(16, 185, 129, 0.5)'
        }]
    }

    const chartOptions = {responsive: true, plugins: {legend: {position: 'top'}, title: {display: true, text: 'Site Analytics'}}}
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Project Dashboard
            </h2>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-sm text-gray-500">Active Project:</span>
              <select 
                className="border-gray-300 rounded-md text-sm"
                value={selectedProject?.id || ''}
                onChange={e => setSelectedProject(projects.find(p => p.id === parseInt(e.target.value)))}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex md:ml-4 md:mt-0">
            <button
              onClick={() => setShowModal(true)}
              className="ml-3 inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
            >
              Add New Project
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white shadow-sm rounded-lg border border-gray-100 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Interactive Map</h3>
            <span className="text-xs text-gray-500">Use drawing tools to create sites</span>
          </div>
          <div className="flex-1 w-full relative">
            <Map
              initialViewState={{ longitude: -122.4, latitude: 37.8, zoom: 12 }}
              mapStyle="mapbox://styles/mapbox/outdoors-v12"
              mapboxAccessToken={MAPBOX_TOKEN}
              style={{width: '100%', height: '100%'}}
            >
              <DrawControl
                position="top-left"
                displayControlsDefault={false}
                controls={{ polygon: true, trash: true }}
                defaultMode="draw_polygon"
                onCreate={onDrawCreate}
                onUpdate={() => {}}
                onDelete={() => {}}
                onSelectionChange={onDrawSelectionChange}
              />
            </Map>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg border border-gray-100 h-[600px] flex flex-col">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Analytics Panel</h3>
          </div>
          <div className="p-6 flex-1 overflow-y-auto">
            {selectedSite ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-bold text-gray-800">Selected Site Data</h4>
                  <Bar options={chartOptions} data={chartData} />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div className="text-gray-400">
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No site selected</h3>
                  <p className="mt-1 text-sm text-gray-500">Draw a polygon or select one on the map.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Project Name</label>
                <input required type="text" value={newProjectName} onChange={e=>setNewProjectName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea value={newProjectDesc} onChange={e=>setNewProjectDesc(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2 border"/>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 border rounded-md text-sm font-medium text-white hover:bg-emerald-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
