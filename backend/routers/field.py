from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from datetime import datetime

from backend.database import get_db
from backend.models import MedicineRequest, IncidentReport, Village, User
from backend.dependencies import get_current_user

router = APIRouter(dependencies=[Depends(get_current_user)])


# --- Pydantic Models ---
class MedicineRequestCreate(BaseModel):
    village_id: int
    medicine_name: str
    quantity_needed: int
    urgency: str
    notes: Optional[str] = None

class MedicineRequestUpdate(BaseModel):
    status: str

class IncidentReportCreate(BaseModel):
    village_id: int
    incident_type: str
    severity: str
    description: str

class IncidentReportUpdate(BaseModel):
    status: str


# --- Medicine Requests ---

@router.post("/medicine-requests")
def create_medicine_request(
    req: MedicineRequestCreate, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.id == req.village_id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
        
    db_req = MedicineRequest(
        village_id=req.village_id,
        medicine_name=req.medicine_name,
        quantity_needed=req.quantity_needed,
        urgency=req.urgency,
        notes=req.notes,
        requested_by=user.email, # From token
        status="pending"
    )
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return {"status": "success", "data": db_req}


@router.get("/medicine-requests")
def get_medicine_requests(
    village_id: Optional[int] = None, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(MedicineRequest)
    if village_id:
        query = query.filter(MedicineRequest.village_id == village_id)
    if status:
        query = query.filter(MedicineRequest.status == status)
    
    # We want to include village_name for the feed
    results = []
    for req in query.order_by(MedicineRequest.requested_at.desc()).all():
        village = db.query(Village).filter(Village.id == req.village_id).first()
        r_dict = {
            "id": req.id,
            "village_id": req.village_id,
            "village_name": village.name if village else "Unknown",
            "medicine_name": req.medicine_name,
            "quantity_needed": req.quantity_needed,
            "urgency": req.urgency,
            "requested_by": req.requested_by,
            "requested_at": req.requested_at,
            "status": req.status,
            "notes": req.notes
        }
        results.append(r_dict)
    
    return results


@router.put("/medicine-requests/{req_id}")
def update_medicine_request(
    req_id: int, 
    update: MedicineRequestUpdate, 
    db: Session = Depends(get_db)
):
    db_req = db.query(MedicineRequest).filter(MedicineRequest.id == req_id).first()
    if not db_req:
        raise HTTPException(status_code=404, detail="Medicine request not found")
        
    db_req.status = update.status
    db.commit()
    db.refresh(db_req)
    return {"status": "success", "data": db_req}


# --- Incident Reports ---

@router.post("/incident-reports")
def create_incident_report(
    req: IncidentReportCreate, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    village = db.query(Village).filter(Village.id == req.village_id).first()
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
        
    db_inc = IncidentReport(
        village_id=req.village_id,
        incident_type=req.incident_type,
        severity=req.severity,
        description=req.description,
        reported_by=user.email, # From token
        status="open"
    )
    db.add(db_inc)
    db.commit()
    db.refresh(db_inc)
    return {"status": "success", "data": db_inc}


@router.get("/incident-reports")
def get_incident_reports(
    village_id: Optional[int] = None, 
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(IncidentReport)
    if village_id:
        query = query.filter(IncidentReport.village_id == village_id)
    if status:
        query = query.filter(IncidentReport.status == status)
        
    # We want to include village_name for the feed
    results = []
    for inc in query.order_by(IncidentReport.reported_at.desc()).all():
        village = db.query(Village).filter(Village.id == inc.village_id).first()
        r_dict = {
            "id": inc.id,
            "village_id": inc.village_id,
            "village_name": village.name if village else "Unknown",
            "incident_type": inc.incident_type,
            "severity": inc.severity,
            "description": inc.description,
            "reported_by": inc.reported_by,
            "reported_at": inc.reported_at,
            "status": inc.status
        }
        results.append(r_dict)
        
    return results


@router.put("/incident-reports/{inc_id}")
def update_incident_report(
    inc_id: int, 
    update: IncidentReportUpdate, 
    db: Session = Depends(get_db)
):
    db_inc = db.query(IncidentReport).filter(IncidentReport.id == inc_id).first()
    if not db_inc:
        raise HTTPException(status_code=404, detail="Incident report not found")
        
    db_inc.status = update.status
    db.commit()
    db.refresh(db_inc)
    return {"status": "success", "data": db_inc}
