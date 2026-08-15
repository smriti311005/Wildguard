from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float
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

# Create the table
Base.metadata.create_all(bind=engine)

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
    new_alert = DetectionRecord(**alert.model_dump())
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return {"status": "success", "message": "Alert saved to database", "id": new_alert.id}

@app.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    """Fetches the latest 50 alerts for the Web Dashboard."""
    return db.query(DetectionRecord).order_by(DetectionRecord.id.desc()).limit(50).all()