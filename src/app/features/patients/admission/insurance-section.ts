import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-insurance-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [{ provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) }],
  template: `
    <div class="form-section" formGroupName="insurance">
      <div class="section-header">
        <span class="material-icons-round">account_balance_wallet</span>
        <h3>Financial & Insurance Coverage</h3>
      </div>
      
      <div class="grid-layout">
        <div class="field">
          <label>Insurance Provider*</label>
          <input type="text" formControlName="providerName" placeholder="Primary Provider">
        </div>
        <div class="field">
          <label>Policy / Plan Number*</label>
          <input type="text" formControlName="policyNumber" placeholder="Policy #">
        </div>
        <div class="field">
          <label>Group Number</label>
          <input type="text" formControlName="groupNumber" placeholder="Group #">
        </div>
        <div class="field">
          <label>Subscriber ID</label>
          <input type="text" formControlName="subscriberId" placeholder="Sub ID">
        </div>
        <div class="field">
          <label>Group ID</label>
          <input type="text" formControlName="groupId" placeholder="Group ID">
        </div>
        <div class="field">
          <label>Pre-Auth Code (If applicable)</label>
          <input type="text" formControlName="authorizationCode" placeholder="Auth Code">
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">assignment_ind</span>
        <h3>Policy Holder Details</h3>
      </div>
      <div class="grid-layout">
        <div class="field">
          <label>Primary Holder Name*</label>
          <input type="text" formControlName="holderName" placeholder="Full Name">
        </div>
        <div class="field">
          <label>Holder DOB*</label>
          <input type="date" formControlName="holderDob">
        </div>
        <div class="field">
          <label>Relation to Patient</label>
          <select formControlName="holderRelation">
            <option value="Self">Self</option>
            <option value="Spouse">Spouse</option>
            <option value="Child">Child</option>
            <option value="Employer">Employer</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">contact_emergency</span>
        <h3>Primary Care Physician</h3>
      </div>
      <div class="grid-layout">
        <div class="field">
          <label>PCP Name</label>
          <input type="text" formControlName="pcpName" placeholder="Dr. Name">
        </div>
        <div class="field">
          <label>PCP Contact</label>
          <input type="tel" formControlName="pcpPhone" placeholder="Phone Number">
        </div>
        <div class="field d-flex align-items-center mt-3">
          <label class="checkbox-item mb-0"><input type="checkbox" formControlName="referralRequired"> Referral Required</label>
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">payments</span>
        <h3>Billing Summary</h3>
      </div>
      <div class="grid-layout">
        <div class="field">
          <label>Deductible Met ($)</label>
          <input type="number" formControlName="deductibleMet" placeholder="0.00">
        </div>
        <div class="field">
          <label>Copay Amount ($)</label>
          <input type="number" formControlName="copayAmount" placeholder="0.00">
        </div>
      </div>

      <div class="info-alert mt-4">
        <span class="material-icons-round">verified</span>
        <p>Insurance verification status: <strong>Pending Electronic Verification</strong></p>
      </div>
    </div>
  `,
  styleUrl: './admission.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InsuranceSection { }
