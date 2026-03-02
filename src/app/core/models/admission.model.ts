export interface Admission {
    id?: number;
    patientId: number;
    patientName: string;
    admissionDate: string;
    dischargeDate?: string;
    roomNumber: string;
    doctorInCharge: string;
    medicalHistory: string; // JSON string
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateAdmissionDto {
    patientId: number;
    patientName: string;
    admissionDate: string;
    roomNumber: string;
    doctorInCharge: string;
    medicalHistory: string; // JSON string
}
