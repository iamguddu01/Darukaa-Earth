from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str
    
    
class Token(BaseModel):
    access_token: str
    token_type: str
    
    
class ProjectCreate(BaseModel):
    name: str
    description: str
    
class ProjectOut(BaseModel):
    id: int
    name: str
    description: str
    
    class Config:
        from_attributes: True
        
class SiteCreate(BaseModel):
    name: str
    project_id: int
    geojson_polygon: dict
    
class SiteOut(BaseModel):
    id: int
    name: str
    project_id: int
    geojson_polygon: dict