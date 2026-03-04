import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayout } from './layout/main-layout/main-layout';
import { Login } from './features/login/login';

export const routes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'qr-login',
        loadComponent: () => import('./features/login/qr-login/qr-login').then(m => m.QrLogin)
    },
    {
        path: 'qr-mobile-auth',
        loadComponent: () => import('./features/login/qr-mobile-auth/qr-mobile-auth').then(m => m.QrMobileAuth)
    },
    {
        path: '',
        component: MainLayout,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
                data: { roles: ['Admin', 'Doctor', 'Nurse'] }
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/patient-portal/dashboard/patient-dashboard').then(m => m.PatientDashboard),
                data: { roles: ['Patient'] }
            },
            {
                path: 'patients',
                loadChildren: () => import('./features/patients/patients.routes').then(m => m.PATIENT_ROUTES),
                data: { roles: ['Admin', 'Doctor', 'Nurse'] }
            },
            {
                path: 'admissions',
                loadComponent: () => import('./features/admissions/admission-list/admission-list').then(m => m.AdmissionListComponent),
                data: { roles: ['Admin', 'Doctor', 'Nurse'] }
            },
            {
                path: 'appointments',
                loadComponent: () => import('./features/appointments/appointments').then(m => m.Appointments),
                data: { roles: ['Admin', 'Doctor', 'Nurse'] }
            },
            {
                path: 'appointments/new',
                loadComponent: () => import('./features/appointments/appointment-form/appointment-form').then(m => m.AppointmentFormComponent),
                data: { roles: ['Admin', 'Doctor', 'Nurse'] }
            },
            {
                path: 'medical-records',
                loadComponent: () => import('./features/medical-records/medical-records').then(m => m.MedicalRecords),
                data: { roles: ['Admin', 'Doctor'] }
            },
            {
                path: 'billing',
                loadComponent: () => import('./features/billing/billing').then(m => m.Billing),
                data: { roles: ['Admin'] }
            },
            {
                path: 'billing/new',
                loadComponent: () => import('./features/billing/invoice-form/invoice-form').then(m => m.InvoiceFormComponent),
                data: { roles: ['Admin'] }
            },
            {
                path: 'employee',
                loadComponent: () => import('./features/employee/employee-list/employee-list').then(m => m.EmployeeListComponent),
                data: { roles: ['Admin'] }
            },
            {
                path: 'employee/new',
                loadComponent: () => import('./features/employee/employee-form/employee-form').then(m => m.EmployeeFormComponent),
                data: { roles: ['Admin'] }
            },
            {
                path: 'activity',
                loadComponent: () => import('./features/activity/activity').then(m => m.ActivityComponent),
                data: { roles: ['Admin', 'Doctor'] }
            },
            {
                path: 'statistics',
                loadComponent: () => import('./features/statistics/statistics').then(m => m.StatisticsComponent),
                data: { roles: ['Admin'] }
            },
            {
                path: 'help',
                loadComponent: () => import('./features/help/help').then(m => m.HelpComponent),
                data: { roles: ['Admin', 'Doctor', 'Nurse', 'Patient'] }
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings/settings').then(m => m.SettingsComponent),
                data: { roles: ['Admin', 'Doctor', 'Nurse', 'Patient'] }
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/reports/reports').then(m => m.ReportsComponent),
                data: { roles: ['Admin'] }
            }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
