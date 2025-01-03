export const globalErrorMessages = {
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  INVALID_PASSWORD: 'USER_NOT_FOUND',
  SOMETHING_WENT_WRONG: 'SOMETHING_WENT_WRONG',
  YOU_ARE_NOT_ALLOWED_TO_MANAGE_THIS_RESOURCE:
    'YOU_ARE_NOT_ALLOWED_TO_MANAGE_THIS_RESOURCE',
  YOU_ARE_NOT_AUTHORIZED_TO_PERFORM_THIS_ACTION:
    'YOU_ARE_NOT_AUTHORIZED_TO_PERFORM_THIS_ACTION',
  PASSWORD_HAS_BEEN_USED_RECENTLY: 'PASSWORD_HAS_BEEN_USED_RECENTLY',
  PASSWORD_TOO_SHORT:
    'Password must be minimum 8 characters long and contain at least one letter and one number',
  PASSWORDS_DO_NOT_MATCH: 'PASSWORDS_DO_NOT_MATCH',
  INVALID_PHONE_NUMBER: 'INVALID_PHONE_NUMBER',
  END_DATE_MUST_BE_AFTER_START_DATE: 'END_DATE_MUST_BE_AFTER_START_DATE',
};

export const doctorErrorMessages = {
  DOCTOR_NOT_FOUND: 'DOCTOR_NOT_FOUND',
  DOCTOR_ALREADY_EXISTS: 'DOCTOR_ALREADY_EXISTS',
};

export const patientErrorMessages = {
  PATIENT_NOT_FOUND: 'PATIENT_NOT_FOUND',
  PATIENT_ALREADY_EXISTS: 'PATIENT_ALREADY_EXISTS',
};

export const appointmentErrorMessages = {
  APPOINTMENT_NOT_FOUND: 'APPOINTMENT_NOT_FOUND',
  APPOINTMENT_DATE_TIME_MUST_BE_IN_FUTURE:
    'APPOINTMENT_DATE_TIME_MUST_BE_IN_FUTURE',
  APPOINTMENT_ALREADY_SCHEDULED_FOR_THIS_TIME:
    'APPOINTMENT_ALREADY_SCHEDULED_FOR_THIS_TIME',
};

export const prescriptionErrorMessages = {
  PRESCRIPTION_NOT_FOUND: 'PRESCRIPTION_NOT_FOUND',
};

export const medicalHistoryErrorMessages = {
  MEDICAL_HISTORY_NOT_FOUND: 'MEDICAL_HISTORY_NOT_FOUND',
  MEDICAL_HISTORY_RECORD_ALREADY_EXISTS:
    'MEDICAL_HISTORY_RECORD_ALREADY_EXISTS',
};
