import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DemographicsSection } from './demographics-section';
import { HistorySection } from './history-section';
import { VitalsSection } from './vitals-section';
import { InsuranceSection } from './insurance-section';
import { LegalSection } from './legal-section';

type AdmissionTab = 'demographics' | 'history' | 'vitals' | 'insurance' | 'legal';

@Component({
    selector: 'app-admission',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DemographicsSection,
        HistorySection,
        VitalsSection,
        InsuranceSection,
        LegalSection
    ],
    templateUrl: './admission.html',
    styleUrl: './admission.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdmissionComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);

    activeTab = signal<AdmissionTab>('demographics');
    submitting = signal(false);

    // Modular Form Structure with 110+ fields
    admissionForm: FormGroup = this.fb.group({
        demographics: this.fb.group({
            firstName: ['', Validators.required],
            middleName: [''],
            lastName: ['', Validators.required],
            dob: ['', [Validators.required, pastDateValidator]],
            gender: ['', Validators.required],
            ssn: [''],
            maritalStatus: ['Single'],
            religion: [''],
            preferredLanguage: ['English'],
            nationality: [''],
            occupation: [''],
            employer: [''],
            email: ['', Validators.email],
            phone: ['', Validators.required],
            addressLine1: ['', Validators.required],
            addressLine2: [''],
            city: ['', Validators.required],
            state: ['', Validators.required],
            zipCode: ['', Validators.required],
            emergencyContactName: ['', Validators.required],
            emergencyContactRelation: ['', Validators.required],
            emergencyContactPhone: ['', Validators.required],
            emergencyContactEmail: [''],
            emergencyContactAddress: ['']
        }),
        medicalHistory: this.fb.group({
            chronicProgressiveDiseases: [[]],
            previousSurgeries: [''],
            previousHospitalizations: [''],
            drugAllergies: [''],
            foodAllergies: [''],
            environmentalAllergies: [''],
            currentMedications: [''],
            familyHistoryHeart: [false],
            familyHistoryDiabetes: [false],
            familyHistoryCancer: [false],
            familyHistoryHypertension: [false],
            familyHistoryStroke: [false],
            familyHistoryOther: [''],
            tobaccoUse: ['Never'],
            tobaccoFrequency: [''],
            alcoholUse: ['Never'],
            alcoholFrequency: [''],
            recreationalDrugUse: ['No'],
            exerciseFrequency: [''],
            travelHistoryRecent: ['']
        }),
        vitals: this.fb.group({
            height: [null, [Validators.required, Validators.min(10)]],
            weight: [null, [Validators.required, Validators.min(1)]],
            bmi: [{ value: null, disabled: true }],
            bloodPressure: ['', Validators.required],
            temperature: [null, Validators.required],
            pulseRate: [null, Validators.required],
            respiratoryRate: [null, Validators.required],
            oxygenSaturation: [null, Validators.required],
            painLevel: [0],
            consciousnessLevel: ['Alert'],
            pupilsReaction: ['Normal'],
            skinTurgor: ['Normal'],
            edemaPresence: ['None'],
            heartSounds: ['Normal'],
            lungSounds: ['Clear'],
            abdominalSounds: ['Normal'],
            mobilityStatus: ['Independent'],
            neuroNotes: [''],
            cardioNotes: [''],
            respNotes: [''],
            giNotes: [''],
            guNotes: [''],
            musculoNotes: [''],
            chiefComplaint: ['', Validators.required],
            admissionNote: [''],
            modeOfArrival: ['Walk-in'],
            patientIdVerified: [false],
            valuablesStored: [false],
            nurseAssigned: [''],
            doctorAssigned: [''],
            wardDepartment: ['General']
        }),
        insurance: this.fb.group({
            providerName: ['', Validators.required],
            policyNumber: ['', Validators.required],
            groupNumber: [''],
            holderName: ['', Validators.required],
            holderDob: ['', Validators.required],
            holderRelation: ['Self'],
            subscriberId: [''],
            groupId: [''],
            deductibleMet: [0],
            copayAmount: [0],
            referralRequired: [false],
            pcpName: [''],
            pcpPhone: [''],
            authorizationCode: ['']
        }),
        legalConsent: this.fb.group({
            advancedDirective: [false],
            directiveType: [''],
            organDonor: [false],
            powerOfAttorneyName: [''],
            powerOfAttorneyRelation: [''],
            powerOfAttorneyPhone: [''],
            powerOfAttorneyAddress: [''],
            consentToTreat: [false, Validators.requiredTrue],
            releaseOfInfo: [false, Validators.requiredTrue],
            assignmentOfBenefits: [false, Validators.requiredTrue],
            privacyNotice: [false, Validators.requiredTrue],
            witnessName: [''],
            signatureDate: [new Date().toISOString().split('T')[0]]
        })
    });

    constructor() {
        this.setupBmiCalculation();
    }

    private setupBmiCalculation() {
        this.admissionForm.get('vitals.height')?.valueChanges.subscribe(() => this.calculateBmi());
        this.admissionForm.get('vitals.weight')?.valueChanges.subscribe(() => this.calculateBmi());
    }

    private calculateBmi() {
        const heightVal = this.admissionForm.get('vitals.height')?.value;
        const weightVal = this.admissionForm.get('vitals.weight')?.value;
        const height = heightVal / 100; // cm to m
        const weight = weightVal;
        if (height > 0 && weight > 0) {
            const bmi = parseFloat((weight / (height * height)).toFixed(2));
            this.admissionForm.get('vitals.bmi')?.setValue(bmi, { emitEvent: false });
        }
    }

    setTab(tab: AdmissionTab) {
        this.activeTab.set(tab);
    }

    onSubmit() {
        if (this.admissionForm.invalid) {
            this.admissionForm.markAllAsTouched();
            // Find and switch to the first tab with an error
            if (this.admissionForm.get('demographics')?.invalid) this.setTab('demographics');
            else if (this.admissionForm.get('medicalHistory')?.invalid) this.setTab('history');
            else if (this.admissionForm.get('vitals')?.invalid) this.setTab('vitals');
            else if (this.admissionForm.get('insurance')?.invalid) this.setTab('insurance');
            else if (this.admissionForm.get('legalConsent')?.invalid) this.setTab('legal');
            return;
        }

        this.submitting.set(true);
        console.log('Admission Form Data:', this.admissionForm.getRawValue());

        // Simulate API call
        setTimeout(() => {
            this.submitting.set(false);
            this.router.navigate(['/patients']);
        }, 1500);
    }

    cancel() {
        this.router.navigate(['/patients']);
    }
}

// Custom Validator
export function pastDateValidator(control: any) {
    if (!control.value) return null;
    const date = new Date(control.value);
    const now = new Date();
    return date > now ? { futureDate: true } : null;
}
