# Patient-Management-System-using-FastAPI-
Simple Patient Management System - a full-stack web application designed to manage patient health records and calculate health metrics.

This is a Patient Management System - a full-stack web application designed to manage patient health records and calculate health metrics.

What It Does
This is essentially a healthcare data management tool with a modern, user-friendly interface built for managing patient records and health metrics.
The application allows healthcare administrators to:

Create, read, update, and delete patient records
Store patient information including demographics and health metrics
Automatically calculate Body Mass Index (BMI) and health status verdicts
Search patients by various fields
Sort patients by different attributes (age, weight, height, BMI, etc.)
View patient details individually or in a list format

Key Features
✓ CRUD operations for patient management
✓ Real-time BMI calculation
✓ Health status classification
✓ Search functionality
✓ Multi-field sorting
✓ Dark/Light theme toggle
✓ Responsive UI with animations
✓ Form validation with Pydantic

Tech Stack
Backend:

Framework: FastAPI (Python)
Server: Uvicorn
Data Storage: JSON file (patients.json)
Database Format: Pydantic models for data validation
Middleware: CORS enabled for cross-origin requests
Frontend:

Framework: React 18 (JSX)
Build Tool: Vite
HTTP Client: Axios
UI Icons: Lucide React
Animation Library: Framer Motion
Styling: CSS with dark/light theme support
Linting: ESLint

Project Flow
Frontend User Interface

React component displays patient list with search, sort, and filter capabilities
User can add new patients via modal form
User can edit or delete existing patients
Dark/Light theme toggle for better UX
API Communication

Frontend makes HTTP requests to the backend via Axios
Endpoints: /view, /patient/{id}, /create, /edit/{id}, /delete/{id}, /sort
Backend Processing

FastAPI validates incoming data using Pydantic models
Automatically computes BMI (weight ÷ height²) and health verdict based on BMI ranges
Manages patient data persistence via JSON file
Provides sorting and filtering capabilities

Health Verdict Classification

BMI < 18.5 → Underweight
BMI 18.5-25 → Normal
BMI 25-30 → Overweight
BMI ≥ 30 → Obese
