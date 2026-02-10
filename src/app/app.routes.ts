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
                path: 'patients',
                loadChildren: () => import('./features/patients/patients.routes').then(m => m.PATIENT_ROUTES),
                data: { roles: ['Admin', 'Doctor', 'Nurse'] }
            },
            {
                path: 'appointments',
                loadComponent: () => import('./features/appointments/appointments').then(m => m.Appointments),
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
                path: 'employee',
                loadComponent: () => import('./features/coming-soon/coming-soon').then(m => m.ComingSoon),
                data: { roles: ['Admin'] }
            },
            {
                path: 'activity',
                loadComponent: () => import('./features/coming-soon/coming-soon').then(m => m.ComingSoon),
                data: { roles: ['Admin', 'Doctor'] }
            },
            {
                path: 'statistics',
                loadComponent: () => import('./features/coming-soon/coming-soon').then(m => m.ComingSoon),
                data: { roles: ['Admin'] }
            },
            {
                path: 'help',
                loadComponent: () => import('./features/coming-soon/coming-soon').then(m => m.ComingSoon),
                data: { roles: ['Admin', 'Doctor', 'Nurse'] }
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/coming-soon/coming-soon').then(m => m.ComingSoon),
                data: { roles: ['Admin', 'Doctor', 'Nurse'] }
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/coming-soon/coming-soon').then(m => m.ComingSoon),
                data: { roles: ['Admin'] }
            }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
