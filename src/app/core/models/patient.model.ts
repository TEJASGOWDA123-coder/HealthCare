export type Gender = 'Male' | 'Female' | 'Other';
export type PatientStatus = 'Stable' | 'Critical' | 'Observation' | 'Recovered';

export interface Patient {
    id: string;
    name: string;
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
}

export interface CreatePatientDto extends Omit<Patient, 'id'> { }
export interface UpdatePatientDto extends Partial<CreatePatientDto> { }
