import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-legal-section',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    viewProviders: [{ provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) }],
    template: `
    <div class="form-section" formGroupName="legalConsent">
      <div class="section-header">
        <span class="material-icons-round">gavel</span>
        <h3>Advanced Directives & Legal</h3>
      </div>
      
      <div class="grid-layout">
        <div class="field d-flex align-items-center">
          <label class="checkbox-item mb-0"><input type="checkbox" formControlName="advancedDirective"> Advanced Directive on File</label>
        </div>
        <div class="field">
          <label>Directive Type</label>
          <select formControlName="directiveType">
            <option value="">None</option>
            <option value="Living Will">Living Will</option>
            <option value="DNR">DNR (Do Not Resuscitate)</option>
            <option value="DNI">DNI (Do Not Intubate)</option>
          </select>
        </div>
        <div class="field d-flex align-items-center">
          <label class="checkbox-item mb-0"><input type="checkbox" formControlName="organDonor"> Organ Donor</label>
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">person_pin</span>
        <h3>Healthcare Power of Attorney</h3>
      </div>
      <div class="grid-layout">
        <div class="field">
          <label>POA Name</label>
          <input type="text" formControlName="powerOfAttorneyName" placeholder="Full Name">
        </div>
        <div class="field">
          <label>Relation</label>
          <input type="text" formControlName="powerOfAttorneyRelation" placeholder="Relation">
        </div>
        <div class="field">
          <label>POA Phone</label>
          <input type="tel" formControlName="powerOfAttorneyPhone" placeholder="Phone Number">
        </div>
        <div class="field full-width">
          <label>POA Address</label>
          <input type="text" formControlName="powerOfAttorneyAddress" placeholder="Full Address">
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">draw</span>
        <h3>Consents & Authorizations</h3>
      </div>
      <div class="checkbox-stack bg-slate-50 p-6 rounded-2xl border border-slate-100">
        <label class="checkbox-item mb-4">
          <input type="checkbox" formControlName="consentToTreat">
          <span>I formally <strong>consent to diagnostic and medical treatment</strong> as deemed necessary by the attending physician.</span>
        </label>
        <label class="checkbox-item mb-4">
          <input type="checkbox" formControlName="releaseOfInfo">
          <span>I authorize the <strong>release of medical information</strong> to insurance providers for billing purposes.</span>
        </label>
        <label class="checkbox-item mb-4">
          <input type="checkbox" formControlName="assignmentOfBenefits">
          <span>I <strong>assign all insurance benefits</strong> to be paid directly to the hospital for services rendered.</span>
        </label>
        <label class="checkbox-item">
          <input type="checkbox" formControlName="privacyNotice">
          <span>I acknowledge receipt of the <strong>HIPAA Notice of Privacy Practices</strong>.</span>
        </label>
      </div>

      <div class="grid-layout mt-6">
        <div class="field">
          <label>Witness Name</label>
          <input type="text" formControlName="witnessName" placeholder="Witness Full Name">
        </div>
        <div class="field">
          <label>Signature Date</label>
          <input type="date" formControlName="signatureDate">
        </div>
      </div>
    </div>
  `,
    styleUrl: './admission.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LegalSection { }
