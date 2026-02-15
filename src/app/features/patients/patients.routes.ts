import { Routes } from '@angular/router';

export const PATIENT_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./patient-list/patient-list').then(m => m.PatientListComponent)
    },
    {
        path: 'new',
        loadComponent: () => import('./patient-form/patient-form').then(m => m.PatientFormComponent)
    },
    {
        path: 'edit/:id',
        loadComponent: () => import('./patient-form/patient-form').then(m => m.PatientFormComponent)
    },
    {
        path: 'admission',
        loadComponent: () => import('./admission/admission').then(m => m.AdmissionComponent)
    }
];
