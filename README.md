# Clinic Management System API

This API provides endpoints for managing doctors, patients, appointments, prescriptions, and medical history. It is built using **NestJS** and **Mongoose**.

## Features

- **Doctor and Patient Management**: Create and manage doctor and patient accounts with administrative endpoints.
- **Appointments**: Create, update, and manage appointments, linking them to both doctors and patients.
- **Prescriptions**: Manage prescriptions for appointments, ensuring that prescriptions cannot be issued without an associated appointment.
- **Medical History**: Store patient medical history, including diagnosis, treatments, and notes, with optional links to specific appointments.
- **Validation**: All requests are validated using **DTOs** and **class-validator** to ensure data integrity.
- **MongoDB**: NoSQL database used with **Mongoose** for schema management and object modeling.

## Table of Contents

- [Installation](#installation)
- [Endpoints](#endpoints)
  - [Doctor Endpoints](#doctor-endpoints)
  - [Patient Endpoints](#patient-endpoints)
  - [Appointment Endpoints](#appointment-endpoints)
  - [Prescription Endpoints](#prescription-endpoints)
  - [Medical History Endpoints](#medical-history-endpoints)
- [DTOs](#dtos)
  - [Create DTOs](#create-dtos)
  - [Update DTOs](#update-dtos)
  - [Search DTOs](#search-dtos)
- [Models](#models)
- [Validation](#validation)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/oussamasf/doctor-api.git
```

2. Install the dependencies:

```bash
npm install
```

3. Set up the environment variables:

Create a `.env` file in the root directory based on `.env.example`:

4. Run the application:

```bash
npm run start
```

The API will be accessible at `http://localhost:3001`.

## Endpoints

### Doctor Endpoints

- **doctor/account**: Manage doctor account by Own.
- **doctor/appointment**: CRUD Appointments managed by doctors.
- **doctor/patient**: Read patients information.
- **doctor/prescription**: CRUD Prescription managed by doctors.
- **doctor/medical-history**: CRUD Prescription managed by doctors.

### Patient Endpoints

- **patient/account**: Manage patient account by Own.
- **patient/appointment**: Read patient own appointment.
- **patient/prescription**: Read patient own prescription.
- **patient/medical-history**: Read patient own medical-history.

### Administrative Endpoints

- **administrative/account**: Manage administrative accounts by staff.
- **administrative/doctor**: Manage doctors accounts by staff.
- **administrative/patient**: Manage patient accounts by staff.
- **administrative/appointment**: Read appointments.

## DTOs

### Create DTOs

- **CreateDoctorDto**: Defines the structure and validation for creating a doctor.
- **CreatePatientDto**: Defines the structure and validation for creating a patient.
- **CreateAppointmentDto**: Ensures that patient and doctor exist, and validates the date and reason.
- **CreatePrescriptionDto**: Ensures a prescription is linked to an appointment, with validation for medications, dosage, and duration.
- **CreateMedicalHistoryDto**: Defines the required fields for recording medical history.

### Update DTOs

- **UpdateDoctorDto**: Allows partial updates of doctor information.
- **UpdatePatientDto**: Allows partial updates of patient information.
- **UpdateAppointmentDto**: Allows partial updates of appointment details.
- **UpdatePrescriptionDto**: Allows partial updates of prescription details.
- **UpdateMedicalHistoryDto**: Allows partial updates of medical history records.

### Search and Filter DTOs

- **DoctorSearchDto**: Filters doctors by specialization, name, etc.
- **PatientSearchDto**: Filters patients by name, date of birth, etc.
- **AppointmentSearchDto**: Filters appointments by doctor, patient, date, etc.
- **PrescriptionSearchDto**: Filters prescriptions by doctor, patient, appointment, etc.
- **MedicalHistorySearchDto**: Filters medical history records by patient, doctor, diagnosis, etc.

## Models

- **Doctor Model**: Stores doctor details such as name, email, password (hashed), and specialization.
- **Patient Model**: Stores patient details such as name, email, password (hashed), date of birth, and address.
- **Appointment Model**: Links a patient and doctor, with a specific date, time, and reason for the appointment.
- **Prescription Model**: Links a prescription to an appointment and stores the medications, dosage, frequency, and duration.
- **Medical History Model**: Records patient medical history including diagnosis, treatment, and optional appointment reference.

## Validation

The system uses **DTOs** and **class-validator** for validation. Each DTO ensures that only valid data is passed to the database. For example:

- **patientId** and **doctorId** are validated to ensure they exist in the system.
- Dates are validated for correct format (e.g., YYYY-MM-DD for appointments).
- Prescriptions cannot be created without a valid appointment.

## Error Handling

The API handles errors gracefully, returning appropriate HTTP status codes and error messages. For instance:

- **404 Not Found**: Returned when a requested resource (doctor, patient, appointment, etc.) does not exist.
- **400 Bad Request**: Returned when validation fails for any DTO.
- **500 Internal Server Error**: Returned for unexpected server issues.

## Appointment Restrictions:

- **Patient Not Found**: The appointment cannot be created if the provided `patientId` does not exist in the database.
- **Past Appointment Date**: The appointment cannot be created if the specified date is in the past.
- **Conflicting Appointment**: The appointment cannot be created if the patient or doctor already has an appointment scheduled at the same time.

## Prescription Restrictions:

- **Patient Not Found**: The prescription cannot be created if the provided `patientId` does not exist.
- **Appointment Not Found**: The prescription cannot be created if the specified `appointmentId` does not exist or doesn't belong to the requesting doctor.
- **Appointment Not Today**: The prescription cannot be created if the associated appointment is not scheduled for today.

## Medical History Restrictions:

- **Duplicate Medical History**: Cannot create a medical history if a record already exists for the same `prescriptionId`.
- **Patient Not Found**: Cannot create a medical history if the provided `patientId` does not exist.
- **Prescription Not Found**: Cannot create a medical history if the provided `prescriptionId` does not exist or doesn't belong to the requesting doctor.
