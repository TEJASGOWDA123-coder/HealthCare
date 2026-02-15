export type Gender = 'Male' | 'Female' | 'Other';
export type PatientStatus = 'Stable' | 'Critical' | 'Observation' | 'Recovered';

export interface Demographics {
    firstName: string;
    middleName?: string;
    lastName: string;
    dob: string;
    ssn?: string;
    occupation?: string;
    employer?: string;
    emergencyContactName: string;
    emergencyContactRelation: string;
    emergencyContactPhone: string;
}

export interface MedicalHistory {
    chronicProgressiveDiseases: string[];
    previousSurgeries: string;
    allergies: string;
    medications: string;
    familyHistory: string;
    tobaccoUse: 'Never' | 'Former' | 'Current';
    alcoholUse: 'Never' | 'Occasional' | 'Frequent';
}

export interface Vitals {
    height: number;
    weight: number;
    bmi: number;
    bloodPressure: string;
    temperature: number;
    pulseRate: number;
    respiratoryRate: number;
    oxygenSaturation: number;
}

export interface Insurance {
    providerName: string;
    policyNumber: string;
    groupNumber?: string;
    holderName: string;
    holderDob: string;
    holderRelation: string;
}

export interface AdmissionData {
    demographics: Demographics;
    medicalHistory: MedicalHistory;
    vitals: Vitals;
    insurance: Insurance;
    chiefComplaint: string;
    admissionNote?: string;
}

export interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    name?: string; // Optional display name
    dateOfBirth: string | null;
    age: number;
    gender: Gender;
    lastVisit: string;
    condition: string;
    status: PatientStatus;
    room: string;
    phone: string;
    email: string;
    address?: string;
    bloodGroup?: string;
    admission?: AdmissionData;
}

export interface CreatePatientDto extends Omit<Patient, 'id'> { }
export interface UpdatePatientDto extends Partial<CreatePatientDto> { }
