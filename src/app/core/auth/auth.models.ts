export type Role = 'Admin' | 'Doctor' | 'Nurse';

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    avatar?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user?: User;
    role?: Role;
}
