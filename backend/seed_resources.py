"""
seed_resources.py — Seed illustrative VillageResource data for the demo.

Run from project root:
    python -m backend.seed_resources

NOTE: All values for staff_count, staff_required, medicine_stock_pct, and
infrastructure_score are ILLUSTRATIVE SAMPLE DATA created for demonstration
purposes only. They do not represent real field measurements.
"""
from backend.database import SessionLocal, engine
from backend.models import Base, District, Village, HealthRecord, VillageResource
from backend.security import get_password_hash
from datetime import datetime, timedelta
import random

# ILLUSTRATIVE sample data — labelled clearly as per requirements
SEED_DATA = [
    # District: Rangpur (to be created or matched by name)
    {
        "district": {"name": "Rangpur", "code": "RGP", "population": 850000, "area_sq_km": 2400.0},
        "villages": [
            {
                "name": "Taraganj", "code": "RGP-01", "population": 12000,
                "latitude": 25.7421, "longitude": 89.2819,
                "resource": {"staff_count": 2, "staff_required": 6, "medicine_stock_pct": 28.0, "infrastructure_score": 42.0},
                "records": [
                    {"disease_type": "Malaria", "case_count": 45, "severity_level": "high", "recorded_by": "Worker A", "days_ago": 30},
                    {"disease_type": "Malaria", "case_count": 62, "severity_level": "critical", "recorded_by": "Worker A", "days_ago": 10},
                    {"disease_type": "Dengue", "case_count": 18, "severity_level": "medium", "recorded_by": "Worker B", "days_ago": 5},
                ],
            },
            {
                "name": "Badarganj", "code": "RGP-02", "population": 8500,
                "latitude": 25.6710, "longitude": 89.0560,
                "resource": {"staff_count": 4, "staff_required": 5, "medicine_stock_pct": 72.0, "infrastructure_score": 65.0},
                "records": [
                    {"disease_type": "Cholera", "case_count": 12, "severity_level": "medium", "recorded_by": "Worker C", "days_ago": 20},
                    {"disease_type": "Cholera", "case_count": 9, "severity_level": "low", "recorded_by": "Worker C", "days_ago": 7},
                ],
            },
            {
                "name": "Mithapukur", "code": "RGP-03", "population": 15000,
                "latitude": 25.5023, "longitude": 89.2847,
                "resource": {"staff_count": 1, "staff_required": 7, "medicine_stock_pct": 15.0, "infrastructure_score": 30.0},
                "records": [
                    {"disease_type": "Tuberculosis", "case_count": 28, "severity_level": "high", "recorded_by": "Worker D", "days_ago": 45},
                    {"disease_type": "Tuberculosis", "case_count": 35, "severity_level": "high", "recorded_by": "Worker D", "days_ago": 15},
                    {"disease_type": "Malaria", "case_count": 52, "severity_level": "critical", "recorded_by": "Worker A", "days_ago": 3},
                ],
            },
            {
                "name": "Pirganj", "code": "RGP-04", "population": 9200,
                "latitude": 25.8581, "longitude": 88.9012,
                "resource": {"staff_count": 5, "staff_required": 5, "medicine_stock_pct": 88.0, "infrastructure_score": 78.0},
                "records": [
                    {"disease_type": "Dengue", "case_count": 6, "severity_level": "low", "recorded_by": "Worker E", "days_ago": 12},
                ],
            },
            {
                "name": "Kaunia", "code": "RGP-05", "population": 7800,
                "latitude": 25.6312, "longitude": 89.4521,
                "resource": {"staff_count": 3, "staff_required": 5, "medicine_stock_pct": 55.0, "infrastructure_score": 58.0},
                "records": [
                    {"disease_type": "Malaria", "case_count": 20, "severity_level": "medium", "recorded_by": "Worker F", "days_ago": 25},
                    {"disease_type": "Malaria", "case_count": 27, "severity_level": "medium", "recorded_by": "Worker F", "days_ago": 8},
                ],
            },
        ],
    },
    # District: Dinajpur
    {
        "district": {"name": "Dinajpur", "code": "DNJ", "population": 620000, "area_sq_km": 3437.0},
        "villages": [
            {
                "name": "Chirirbandar", "code": "DNJ-01", "population": 10500,
                "latitude": 25.5412, "longitude": 88.7823,
                "resource": {"staff_count": 2, "staff_required": 6, "medicine_stock_pct": 22.0, "infrastructure_score": 38.0},
                "records": [
                    {"disease_type": "Malaria", "case_count": 38, "severity_level": "high", "recorded_by": "Worker G", "days_ago": 35},
                    {"disease_type": "Malaria", "case_count": 55, "severity_level": "critical", "recorded_by": "Worker G", "days_ago": 10},
                ],
            },
            {
                "name": "Fulbari", "code": "DNJ-02", "population": 7200,
                "latitude": 25.7010, "longitude": 88.6241,
                "resource": {"staff_count": 4, "staff_required": 5, "medicine_stock_pct": 65.0, "infrastructure_score": 62.0},
                "records": [
                    {"disease_type": "Cholera", "case_count": 14, "severity_level": "medium", "recorded_by": "Worker H", "days_ago": 18},
                ],
            },
            {
                "name": "Ghoraghat", "code": "DNJ-03", "population": 6800,
                "latitude": 25.3651, "longitude": 89.2012,
                "resource": {"staff_count": 0, "staff_required": 4, "medicine_stock_pct": 10.0, "infrastructure_score": 25.0},
                "records": [
                    {"disease_type": "Typhoid", "case_count": 30, "severity_level": "high", "recorded_by": "Worker I", "days_ago": 40},
                    {"disease_type": "Typhoid", "case_count": 44, "severity_level": "critical", "recorded_by": "Worker I", "days_ago": 12},
                    {"disease_type": "Malaria", "case_count": 20, "severity_level": "high", "recorded_by": "Worker G", "days_ago": 4},
                ],
            },
            {
                "name": "Hakimpur", "code": "DNJ-04", "population": 5400,
                "latitude": 25.1823, "longitude": 88.9512,
                "resource": {"staff_count": 3, "staff_required": 4, "medicine_stock_pct": 80.0, "infrastructure_score": 70.0},
                "records": [
                    {"disease_type": "Dengue", "case_count": 8, "severity_level": "low", "recorded_by": "Worker J", "days_ago": 14},
                ],
            },
            {
                "name": "Kaharole", "code": "DNJ-05", "population": 8900,
                "latitude": 25.6012, "longitude": 88.5123,
                "resource": {"staff_count": 2, "staff_required": 5, "medicine_stock_pct": 42.0, "infrastructure_score": 48.0},
                "records": [
                    {"disease_type": "Malaria", "case_count": 22, "severity_level": "medium", "recorded_by": "Worker K", "days_ago": 22},
                    {"disease_type": "Malaria", "case_count": 30, "severity_level": "high", "recorded_by": "Worker K", "days_ago": 6},
                ],
            },
        ],
    },
    # District: Kurigram
    {
        "district": {"name": "Kurigram", "code": "KRG", "population": 450000, "area_sq_km": 2296.0},
        "villages": [
            {
                "name": "Bhurungamari", "code": "KRG-01", "population": 9100,
                "latitude": 26.0241, "longitude": 89.7612,
                "resource": {"staff_count": 1, "staff_required": 5, "medicine_stock_pct": 18.0, "infrastructure_score": 35.0},
                "records": [
                    {"disease_type": "Malaria", "case_count": 50, "severity_level": "critical", "recorded_by": "Worker L", "days_ago": 20},
                    {"disease_type": "Cholera", "case_count": 25, "severity_level": "high", "recorded_by": "Worker M", "days_ago": 8},
                ],
            },
            {
                "name": "Chilmari", "code": "KRG-02", "population": 6700,
                "latitude": 25.9012, "longitude": 89.6523,
                "resource": {"staff_count": 3, "staff_required": 5, "medicine_stock_pct": 60.0, "infrastructure_score": 55.0},
                "records": [
                    {"disease_type": "Dengue", "case_count": 11, "severity_level": "medium", "recorded_by": "Worker N", "days_ago": 15},
                ],
            },
            {
                "name": "Nageshwari", "code": "KRG-03", "population": 11200,
                "latitude": 25.9723, "longitude": 89.8912,
                "resource": {"staff_count": 4, "staff_required": 6, "medicine_stock_pct": 75.0, "infrastructure_score": 68.0},
                "records": [
                    {"disease_type": "Tuberculosis", "case_count": 16, "severity_level": "medium", "recorded_by": "Worker O", "days_ago": 30},
                    {"disease_type": "Tuberculosis", "case_count": 18, "severity_level": "medium", "recorded_by": "Worker O", "days_ago": 10},
                ],
            },
            {
                "name": "Ulipur", "code": "KRG-04", "population": 8300,
                "latitude": 25.7812, "longitude": 89.5923,
                "resource": {"staff_count": 2, "staff_required": 4, "medicine_stock_pct": 48.0, "infrastructure_score": 52.0},
                "records": [
                    {"disease_type": "Malaria", "case_count": 24, "severity_level": "medium", "recorded_by": "Worker P", "days_ago": 18},
                    {"disease_type": "Malaria", "case_count": 31, "severity_level": "high", "recorded_by": "Worker P", "days_ago": 5},
                ],
            },
            {
                "name": "Rajibpur", "code": "KRG-05", "population": 4900,
                "latitude": 25.6523, "longitude": 89.6112,
                "resource": {"staff_count": 5, "staff_required": 5, "medicine_stock_pct": 90.0, "infrastructure_score": 82.0},
                "records": [
                    {"disease_type": "Dengue", "case_count": 4, "severity_level": "low", "recorded_by": "Worker Q", "days_ago": 20},
                ],
            },
        ],
    },
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        for dist_data in SEED_DATA:
            # Upsert district
            d_info = dist_data["district"]
            district = db.query(District).filter(District.name == d_info["name"]).first()
            if not district:
                district = District(**d_info)
                db.add(district)
                db.flush()

            for v_data in dist_data["villages"]:
                # Upsert village
                village = db.query(Village).filter(Village.code == v_data["code"]).first()
                if not village:
                    village = Village(
                        name=v_data["name"],
                        code=v_data["code"],
                        district_id=district.id,
                        population=v_data["population"],
                        latitude=v_data["latitude"],
                        longitude=v_data["longitude"],
                    )
                    db.add(village)
                    db.flush()

                # Upsert VillageResource
                res = db.query(VillageResource).filter(VillageResource.village_id == village.id).first()
                if not res:
                    res = VillageResource(village_id=village.id, **v_data["resource"])
                    db.add(res)
                else:
                    for k, v in v_data["resource"].items():
                        setattr(res, k, v)

                # Seed health records (only if none exist for this village)
                existing = db.query(HealthRecord).filter(HealthRecord.village_id == village.id).count()
                if existing == 0:
                    for rec in v_data["records"]:
                        db.add(HealthRecord(
                            district_id=district.id,
                            village_id=village.id,
                            disease_type=rec["disease_type"],
                            case_count=rec["case_count"],
                            severity_level=rec["severity_level"],
                            recorded_by=rec["recorded_by"],
                            recorded_at=datetime.utcnow() - timedelta(days=rec["days_ago"]),
                            outcome_status="pending",
                        ))

        db.commit()
        print("✅ Seed data inserted successfully.")
        print("NOTE: All resource data is ILLUSTRATIVE SAMPLE DATA for the demo.")
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding data: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()
