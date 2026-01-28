from fastapi import FastAPI, Path, HTTPException, Query
import json
from pydantic import BaseModel, Field, computed_field
from typing import Annotated, Literal, Optional
import uvicorn
from starlette.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- MODEL ----------
class Patient(BaseModel):
    id: Annotated[str, Field(..., description= "Patient ID", example="P001")]
    name: Annotated[str, Field(..., description="Patient name")]
    city: Annotated[str, Field(..., description="Patient city")]

    age: Annotated[int, Field(..., gt=0, lt=120, description="Patient age")]
    gender: Annotated[
        Literal["male", "female", "others"],
        Field(..., description="Patient gender"),
    ]

    height: Annotated[float, Field(..., gt=0, description="Height in meters")]
    weight: Annotated[float, Field(..., gt=0, description="Weight in kg")]

    @computed_field
    @property
    def bmi(self) -> float:
        return round(self.weight / (self.height ** 2), 2)

    @computed_field
    @property
    def verdict(self) -> str:
        if self.bmi < 18.5:
            return "underweight"
        elif self.bmi < 25:
            return "normal"
        elif self.bmi < 30:
            return "overweight"
        else:
            return "obese"


class PatientUpdate(BaseModel):
    name: Optional[str] = None
    city: Optional[str] = None
    age: Optional[int] = Field(default=None, gt=0, lt=120)
    gender: Optional[Literal["male", "female", "others"]] = None
    height: Optional[float] = Field(default=None, gt=0)
    weight: Optional[float] = Field(default=None, gt=0)


# DATA HELPERS
def load_data():
    try:
        with open("patients.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {}


def save_data(data):
    with open("patients.json", "w") as f:
        json.dump(data, f, indent=4)


#  ROUTES (decorators)
@app.get("/")
async def root():
    return {"message": "Patient Management System"}


@app.get("/view")
async def view():
    return {"data": load_data()}


@app.get("/patient/{patient_id}")
async def view_patient(
    patient_id: str = Path(..., description="Patient ID", example="P001")
):
    data = load_data()
    if patient_id in data:
        return data[patient_id]
    raise HTTPException(status_code=404, detail="Patient not found")


@app.get("/sort")
async def sort_patients(
    sort_by: str = Query(..., description="Sort field", example="height"),
    order: str = Query("asc", description="Sort order", example="desc"),
):
    valid_fields = ["height", "weight", "bmi"]

    if sort_by not in valid_fields:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid field. Choose from {valid_fields}",
        )

    if order not in ["asc", "desc"]:
        raise HTTPException(
            status_code=400,
            detail="Order must be 'asc' or 'desc'",
        )

    data = load_data()
    sorted_data = sorted(
        data.values(),
        key=lambda x: float(x.get(sort_by, 0)),
        reverse=(order == "desc"),
    )

    return {"data": sorted_data}


@app.post("/create")
async def create_patient(patient: Patient):
    data = load_data()

    if patient.id in data:
        raise HTTPException(
            status_code=400,
            detail="Patient with this ID already exists",
        )

    data[patient.id] = patient.model_dump()
    save_data(data)

    return {"message": "Patient created successfully", "patient": patient}


@app.put("/edit/{patient_id}")
async def update_patient(patient_id: str, patient_update: PatientUpdate):
    data = load_data()

    if patient_id not in data:
        raise HTTPException(status_code=404, detail="Patient not found")

    existing_patient = data[patient_id]
    updates = patient_update.model_dump(exclude_unset=True)

    for key, value in updates.items():
        existing_patient[key] = value

    existing_patient["id"] = patient_id
    updated_patient = Patient(**existing_patient)

    data[patient_id] = updated_patient.model_dump()
    save_data(data)

    return JSONResponse(
        status_code=200,
        content={"message": "Patient updated successfully"},
    )

@app.delete('/delete/{patient_id}')
async def delete_patient(patient_id: str):
    data = load_data()
    if patient_id not in data:
        raise HTTPException(status_code=404, detail="Patient not found")
    del data[patient_id]
    save_data(data)
    return JSONResponse(status_code=200, content={"message": "Patient deleted successfully"})


if __name__ == "__main__":
    uvicorn.run("main:app", reload=True)
