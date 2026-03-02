import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-demographics-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [{ provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) }],
  template: `
    <div class="form-section" formGroupName="demographics">
      <div class="section-header">
        <span class="material-icons-round">person</span>
        <h3>Personal Details</h3>
      </div>
      
      <div class="grid-layout">
        <div class="field" [class.invalid]="admissionForm().get('demographics.patientId')?.invalid && admissionForm().get('demographics.patientId')?.touched">
          <label>Patient ID*</label>
          <input type="number" formControlName="patientId" placeholder="e.g. 1">
          <div class="error-message" *ngIf="admissionForm().get('demographics.patientId')?.invalid && admissionForm().get('demographics.patientId')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.firstName')?.invalid && admissionForm().get('demographics.firstName')?.touched">
          <label>First Name*</label>
          <input type="text" formControlName="firstName" placeholder="First Name">
          <div class="error-message" *ngIf="admissionForm().get('demographics.firstName')?.invalid && admissionForm().get('demographics.firstName')?.touched">Required</div>
        </div>
        <div class="field">
          <label>Middle Name</label>
          <input type="text" formControlName="middleName" placeholder="Middle Name">
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.lastName')?.invalid && admissionForm().get('demographics.lastName')?.touched">
          <label>Last Name*</label>
          <input type="text" formControlName="lastName" placeholder="Last Name">
          <div class="error-message" *ngIf="admissionForm().get('demographics.lastName')?.invalid && admissionForm().get('demographics.lastName')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.dob')?.invalid && admissionForm().get('demographics.dob')?.touched">
          <label>Date of Birth*</label>
          <input type="date" formControlName="dob">
          <div class="error-message" *ngIf="admissionForm().get('demographics.dob')?.errors?.['required'] && admissionForm().get('demographics.dob')?.touched">Required</div>
          <div class="error-message" *ngIf="admissionForm().get('demographics.dob')?.errors?.['futureDate'] && admissionForm().get('demographics.dob')?.touched">Date cannot be in future</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.gender')?.invalid && admissionForm().get('demographics.gender')?.touched">
          <label>Gender*</label>
          <select formControlName="gender">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <div class="error-message" *ngIf="admissionForm().get('demographics.gender')?.invalid && admissionForm().get('demographics.gender')?.touched">Required</div>
        </div>
        <div class="field">
          <label>SSN / National ID</label>
          <input type="text" formControlName="ssn" placeholder="XXX-XX-XXXX">
        </div>
        <div class="field">
          <label>Marital Status</label>
          <select formControlName="maritalStatus">
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        <div class="field">
          <label>Preferred Language</label>
          <input type="text" formControlName="preferredLanguage" placeholder="e.g. English, Spanish">
        </div>
        <div class="field">
          <label>Occupation</label>
          <input type="text" formControlName="occupation" placeholder="Occupation">
        </div>
        <div class="field">
          <label>Employer</label>
          <input type="text" formControlName="employer" placeholder="Employer Name">
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">contact_mail</span>
        <h3>Contact Information</h3>
      </div>
      <div class="grid-layout">
        <div class="field">
          <label>Email Address</label>
          <input type="email" formControlName="email" placeholder="name@example.com">
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.phone')?.invalid && admissionForm().get('demographics.phone')?.touched">
          <label>Phone Number*</label>
          <input type="tel" formControlName="phone" placeholder="Phone Number">
          <div class="error-message" *ngIf="admissionForm().get('demographics.phone')?.invalid && admissionForm().get('demographics.phone')?.touched">Required</div>
        </div>
        <div class="field full-width" [class.invalid]="admissionForm().get('demographics.addressLine1')?.invalid && admissionForm().get('demographics.addressLine1')?.touched">
          <label>Address Line 1*</label>
          <input type="text" formControlName="addressLine1" placeholder="Street layout, Apt #">
          <div class="error-message" *ngIf="admissionForm().get('demographics.addressLine1')?.invalid && admissionForm().get('demographics.addressLine1')?.touched">Required</div>
        </div>
        <div class="field full-width">
          <label>Address Line 2</label>
          <input type="text" formControlName="addressLine2" placeholder="Suite, Building, etc.">
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.city')?.invalid && admissionForm().get('demographics.city')?.touched">
          <label>City*</label>
          <input type="text" formControlName="city" placeholder="City">
          <div class="error-message" *ngIf="admissionForm().get('demographics.city')?.invalid && admissionForm().get('demographics.city')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.state')?.invalid && admissionForm().get('demographics.state')?.touched">
          <label>State / Province*</label>
          <input type="text" formControlName="state" placeholder="State">
          <div class="error-message" *ngIf="admissionForm().get('demographics.state')?.invalid && admissionForm().get('demographics.state')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.zipCode')?.invalid && admissionForm().get('demographics.zipCode')?.touched">
          <label>Zip / Postal Code*</label>
          <input type="text" formControlName="zipCode" placeholder="Zip Code">
          <div class="error-message" *ngIf="admissionForm().get('demographics.zipCode')?.invalid && admissionForm().get('demographics.zipCode')?.touched">Required</div>
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">emergency</span>
        <h3>Emergency Contact</h3>
      </div>
      <div class="grid-layout">
        <div class="field" [class.invalid]="admissionForm().get('demographics.emergencyContactName')?.invalid && admissionForm().get('demographics.emergencyContactName')?.touched">
          <label>Contact Name*</label>
          <input type="text" formControlName="emergencyContactName" placeholder="Full Name">
          <div class="error-message" *ngIf="admissionForm().get('demographics.emergencyContactName')?.invalid && admissionForm().get('demographics.emergencyContactName')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.emergencyContactRelation')?.invalid && admissionForm().get('demographics.emergencyContactRelation')?.touched">
          <label>Relationship*</label>
          <input type="text" formControlName="emergencyContactRelation" placeholder="Relation">
          <div class="error-message" *ngIf="admissionForm().get('demographics.emergencyContactRelation')?.invalid && admissionForm().get('demographics.emergencyContactRelation')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('demographics.emergencyContactPhone')?.invalid && admissionForm().get('demographics.emergencyContactPhone')?.touched">
          <label>Contact Phone*</label>
          <input type="tel" formControlName="emergencyContactPhone" placeholder="Phone Number">
          <div class="error-message" *ngIf="admissionForm().get('demographics.emergencyContactPhone')?.invalid && admissionForm().get('demographics.emergencyContactPhone')?.touched">Required</div>
        </div>
        <div class="field">
          <label>Contact Email</label>
          <input type="email" formControlName="emergencyContactEmail" placeholder="Email Address">
        </div>
        <div class="field full-width">
          <label>Contact Address</label>
          <input type="text" formControlName="emergencyContactAddress" placeholder="Full Address">
        </div>
      </div>
    </div>
  `,
  styleUrl: './admission.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemographicsSection {
  private controlContainer = inject(ControlContainer);

  admissionForm() {
    return this.controlContainer.control as any;
  }
}
