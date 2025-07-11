from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Client Models
class ClientBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    company: Optional[str] = None

class ClientCreate(ClientBase):
    pass

class ClientUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None

class Client(ClientBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    join_date: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Project Models
class ProjectBase(BaseModel):
    name: str
    client: str
    budget: float
    start_date: str
    end_date: Optional[str] = None
    status: str = "active"  # active, completed, on-hold
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    client: Optional[str] = None
    budget: Optional[float] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None

class Project(ProjectBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_date: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Invoice Models
class InvoiceBase(BaseModel):
    client: str
    project: str
    amount: float
    due_date: str
    status: str = "pending"  # pending, paid, overdue
    description: Optional[str] = None

class InvoiceCreate(InvoiceBase):
    pass

class InvoiceUpdate(BaseModel):
    client: Optional[str] = None
    project: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[str] = None
    status: Optional[str] = None
    description: Optional[str] = None

class Invoice(InvoiceBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    invoice_number: str = Field(default_factory=lambda: f"INV-{int(datetime.now().timestamp())}")
    created_date: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

# Dashboard Stats Model
class DashboardStats(BaseModel):
    total_clients: int
    active_projects: int
    total_revenue: float
    recent_clients: List[Client]
    recent_projects: List[Project]