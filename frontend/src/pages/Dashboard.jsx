import React from 'react'
import Map from 'react-map-gl/mapbox'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Lagend, Legend} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import apiClient from '../api/client';
import DrawControl from '../components/DrawControl'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

function Dashboard() {
  return (
    <div>
      
    </div>
  )
}
import Map from ''

export default Dashboard
