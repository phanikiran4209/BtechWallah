from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
from models import (
    Client, ClientCreate, ClientUpdate,
    Project, ProjectCreate, ProjectUpdate,
    Invoice, InvoiceCreate, InvoiceUpdate,
    DashboardStats
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Collections
clients_collection = db.clients
projects_collection = db.projects
invoices_collection = db.invoices

# Helper function to convert MongoDB document to dict
def serialize_doc(doc):
    if doc and "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc

# Dashboard endpoint
@api_router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats():
    # Get total clients
    total_clients = await clients_collection.count_documents({})
    
    # Get active projects
    active_projects = await projects_collection.count_documents({"status": "active"})
    
    # Calculate total revenue (sum of all project budgets)
    pipeline = [
        {"$group": {"_id": None, "total": {"$sum": "$budget"}}}
    ]
    revenue_result = await projects_collection.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    # Get recent clients (last 5)
    recent_clients_docs = await clients_collection.find().sort("join_date", -1).limit(5).to_list(5)
    recent_clients = [Client(**serialize_doc(doc)) for doc in recent_clients_docs]
    
    # Get recent projects (last 5)
    recent_projects_docs = await projects_collection.find().sort("created_date", -1).limit(5).to_list(5)
    recent_projects = [Project(**serialize_doc(doc)) for doc in recent_projects_docs]
    
    return DashboardStats(
        total_clients=total_clients,
        active_projects=active_projects,
        total_revenue=total_revenue,
        recent_clients=recent_clients,
        recent_projects=recent_projects
    )

# Client endpoints
@api_router.get("/clients", response_model=List[Client])
async def get_clients():
    clients_docs = await clients_collection.find().sort("join_date", -1).to_list(1000)
    return [Client(**serialize_doc(doc)) for doc in clients_docs]

@api_router.post("/clients", response_model=Client)
async def create_client(client: ClientCreate):
    client_obj = Client(**client.dict())
    await clients_collection.insert_one(client_obj.dict())
    return client_obj

@api_router.get("/clients/{client_id}", response_model=Client)
async def get_client(client_id: str):
    client_doc = await clients_collection.find_one({"id": client_id})
    if not client_doc:
        raise HTTPException(status_code=404, detail="Client not found")
    return Client(**serialize_doc(client_doc))

@api_router.put("/clients/{client_id}", response_model=Client)
async def update_client(client_id: str, client_update: ClientUpdate):
    update_data = {k: v for k, v in client_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await clients_collection.update_one(
        {"id": client_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client_doc = await clients_collection.find_one({"id": client_id})
    return Client(**serialize_doc(client_doc))

@api_router.delete("/clients/{client_id}")
async def delete_client(client_id: str):
    result = await clients_collection.delete_one({"id": client_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"message": "Client deleted successfully"}

# Project endpoints
@api_router.get("/projects", response_model=List[Project])
async def get_projects():
    projects_docs = await projects_collection.find().sort("created_date", -1).to_list(1000)
    return [Project(**serialize_doc(doc)) for doc in projects_docs]

@api_router.post("/projects", response_model=Project)
async def create_project(project: ProjectCreate):
    project_obj = Project(**project.dict())
    await projects_collection.insert_one(project_obj.dict())
    return project_obj

@api_router.get("/projects/{project_id}", response_model=Project)
async def get_project(project_id: str):
    project_doc = await projects_collection.find_one({"id": project_id})
    if not project_doc:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**serialize_doc(project_doc))

@api_router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: str, project_update: ProjectUpdate):
    update_data = {k: v for k, v in project_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await projects_collection.update_one(
        {"id": project_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project_doc = await projects_collection.find_one({"id": project_id})
    return Project(**serialize_doc(project_doc))

@api_router.delete("/projects/{project_id}")
async def delete_project(project_id: str):
    result = await projects_collection.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# Invoice endpoints
@api_router.get("/invoices", response_model=List[Invoice])
async def get_invoices():
    invoices_docs = await invoices_collection.find().sort("created_date", -1).to_list(1000)
    return [Invoice(**serialize_doc(doc)) for doc in invoices_docs]

@api_router.post("/invoices", response_model=Invoice)
async def create_invoice(invoice: InvoiceCreate):
    invoice_obj = Invoice(**invoice.dict())
    await invoices_collection.insert_one(invoice_obj.dict())
    return invoice_obj

@api_router.get("/invoices/{invoice_id}", response_model=Invoice)
async def get_invoice(invoice_id: str):
    invoice_doc = await invoices_collection.find_one({"id": invoice_id})
    if not invoice_doc:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return Invoice(**serialize_doc(invoice_doc))

@api_router.put("/invoices/{invoice_id}", response_model=Invoice)
async def update_invoice(invoice_id: str, invoice_update: InvoiceUpdate):
    update_data = {k: v for k, v in invoice_update.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await invoices_collection.update_one(
        {"id": invoice_id},
        {"$set": update_data}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    invoice_doc = await invoices_collection.find_one({"id": invoice_id})
    return Invoice(**serialize_doc(invoice_doc))

@api_router.delete("/invoices/{invoice_id}")
async def delete_invoice(invoice_id: str):
    result = await invoices_collection.delete_one({"id": invoice_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {"message": "Invoice deleted successfully"}

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "Freelancer PM API is running"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()