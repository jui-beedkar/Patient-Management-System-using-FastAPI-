Patient Management System using FastAPI

A full-stack Patient Management System designed to manage patient health records efficiently and calculate key health metrics such as BMI and health status. The application features a modern, responsive UI and a robust FastAPI backend with strong data validation.

Overview

The Patient Management System is a healthcare data management tool that allows administrators to create, view, update, delete, search, and sort patient records. It automatically calculates BMI and assigns a health verdict based on standard medical ranges.

This project demonstrates practical usage of FastAPI, Pydantic, and React in a real-world CRUD application.

Features

Create, Read, Update, Delete (CRUD) patient records
Automatic BMI calculation
Health status classification based on BMI
Search patients by multiple fields
Sort patients by age, height, weight, BMI, etc.
Dark / Light theme toggle
Responsive UI with smooth animations
Input validation using Pydantic

RESTful API architecture

Tech Stack
Backend

Framework: FastAPI (Python)
Server: Uvicorn
Data Storage: JSON file (patients.json)
Data Validation: Pydantic models
Middleware: CORS enabled for frontend integration


Frontend

Framework: React 18
Build Tool: Vite
HTTP Client: Axios
UI Icons: Lucide React
Animations: Framer Motion

Styling: CSS with Dark / Light theme support
Linting: ESLint


Project Flow
Frontend User Interface
Displays a list of patients with search and sort functionality
Modal form to add new patients
Edit and delete existing patient records
Dark / Light theme toggle for better UX


API Communication

Frontend communicates with backend using Axios

REST API endpoints:
/view
/patient/{id}
/create
/edit/{id}
/delete/{id}
/sort

Backend Processing

FastAPI validates incoming data using Pydantic
Automatically computes BMI using weight ÷ height²
Assigns health verdicts based on BMI ranges
Manages patient data persistence via JSON file

Health Verdict Classification
BMI Range	Health Status
BMI < 18.5	Underweight
BMI 18.5 – 25	Normal
BMI 25 – 30	Overweight
BMI ≥ 30	Obese
