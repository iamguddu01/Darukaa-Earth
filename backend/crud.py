from sqlalchemy.orm import Session
from passlib.context import CryptContext
from shapely.geometry import shape, mapping
from geoalchemy2.shape import from_shape, to_shape
import models, schemas

pwd_context  = CryptContext(schemes=["bcrypt"], deprecated= "auto")

def get_user_by_username(db: Session, username:str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user = models.User(username = user.username, password_hash = hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(name = project.name, description= project.description)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project(db:Session):
    return db.query(models.Project).all()

def create_site(db: Session, site: schemas.SiteCreate):
    geom_shape = shape(site.geojson_polygon)
    wkb_geom = from_shape(geom_shape, srid=4326)
    db_site = models.Site(name= site.name, project_id = site.project_id, geometry= wkb_geom)
    db.add(db_site)
    db.commit()
    db.refresh(db_site)
    return{
        "id": db_site.id,
        "name": db_site.name,
        "project_id": db_site.project_id,
        "geojson_polygon": site.geojson_polygon,
    }
    
def get_sites_by_project(db:Session, project_id: int):
    sites = db.query(models.Site).filter(models.Site.project_id == project_id).all()
    out = []
    for s in sites:
        geom_shape = to_shape(s.geometry)
        out.append({
            "id": s.id,
            "name": s.name,
            "project_id": s.project_id,
            "geojson_polygon": mapping(geom_shape)
        })
    return out
