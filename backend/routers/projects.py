from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import schemas, crud, database

router = APIRouter()

@router.post("/projects", response_model=schemas.ProjectOut)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(database.get_db)):
    return crud.create_project(db=db, project=project)

    
@router.get("/projects", response_model=List[schemas.ProjectOut])
def list_projects(db: Session = Depends(database.get_db)):
    return crud.get_project(db)

@router.post("/sites", response_model=schemas.SiteOut)
def create_site(site: schemas.SiteCreate, db: Session = Depends(database.get_db)):
    try:
        return crud.create_site(db=db, site=site)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid GeoJSON: {str(e)}")
    
@router.get("/projects/{project_id}/sites", response_model=List[schemas.SiteOut])
def get_project_site(project_id: int, db: Session = Depends(database.get_db)):
    return crud.get_sites_by_project(db=db, project_id=project_id)