from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session

# ==========================================
# 1. DATABASE SETUP
# ==========================================
# SQLite creates a local file named 'alerts.db' automatically
SQLALCHEMY_DATABASE_URL = "sqlite:///./alerts.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define the Database Table
class DetectionRecord(Base):
    __tablename__ = "detections"
    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, index=True)
    species = Column(String, index=True)
    confidence = Column(Float)
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(String)
    status = Column(String, default="ACTIVE")

# Create the table
Base.metadata.create_all(bind=engine)


def ensure_status_column():
    """Add the status column when upgrading an existing local SQLite database."""
    columns = {
        column["name"]
        for column in inspect(engine).get_columns("detections")
    }

    if "status" not in columns:
        with engine.begin() as connection:
            connection.execute(
                text(
                    "ALTER TABLE detections "
                    "ADD COLUMN status VARCHAR DEFAULT 'ACTIVE'"
                )
            )


ensure_status_column()

# ==========================================
# 2. FASTAPI APPLICATION
# ==========================================
app = FastAPI(title="SIH Wildlife Cloud API")

# Define the expected JSON structure
class AlertPayload(BaseModel):
    node_id: str
    species: str
    confidence: float
    latitude: float
    longitude: float
    timestamp: str


class AlertStatusPayload(BaseModel):
    status: str

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# 3. ENDPOINTS
# ==========================================
@app.post("/api/alerts")
def receive_alert(alert: AlertPayload, db: Session = Depends(get_db)):
    """Receives data from the Edge Node and saves it to SQLite."""
    new_alert = DetectionRecord(
        **alert.model_dump(),
        status="ACTIVE"
    )
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return {"status": "success", "message": "Alert saved to database", "id": new_alert.id}

@app.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    """Fetches the latest 50 alerts for the Web Dashboard."""
    return db.query(DetectionRecord).order_by(DetectionRecord.id.desc()).limit(50).all()


@app.patch("/api/alerts/{alert_id}/status")
def update_alert_status(
    alert_id: int,
    update: AlertStatusPayload,
    db: Session = Depends(get_db)
):
    """Update an incident as acknowledged or resolved from the dashboard."""
    allowed_statuses = {"ACTIVE", "ACKNOWLEDGED", "RESOLVED"}
    requested_status = update.status.upper()

    if requested_status not in allowed_statuses:
        raise HTTPException(
            status_code=422,
            detail="Status must be ACTIVE, ACKNOWLEDGED, or RESOLVED."
        )

    alert = db.get(DetectionRecord, alert_id)

    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found.")

    alert.status = requested_status
    db.commit()
    db.refresh(alert)

    return {
        "status": "success",
        "id": alert.id,
        "alert_status": alert.status
    }
