import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-vitals-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [{ provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) }],
  template: `
    <div class="form-section" formGroupName="vitals">
      <div class="section-header">
        <span class="material-icons-round">medical_information</span>
        <h3>Physical Assessment & Vitals</h3>
      </div>
      
      <div class="grid-layout">
        <div class="field">
          <label>Height (cm)*</label>
          <input type="number" formControlName="height" placeholder="e.g. 175">
        </div>
        <div class="field">
          <label>Weight (kg)*</label>
          <input type="number" formControlName="weight" placeholder="e.g. 70">
        </div>
        <div class="field">
          <label>BMI</label>
          <input type="number" formControlName="bmi" readonly placeholder="Calculated">
        </div>
        <div class="field">
          <label>Blood Pressure*</label>
          <input type="text" formControlName="bloodPressure" placeholder="120/80">
        </div>
        <div class="field">
          <label>Temp (°C)*</label>
          <input type="number" step="0.1" formControlName="temperature" placeholder="36.6">
        </div>
        <div class="field">
          <label>Pulse (BPM)*</label>
          <input type="number" formControlName="pulseRate" placeholder="72">
        </div>
        <div class="field">
          <label>Resp Rate*</label>
          <input type="number" formControlName="respiratoryRate" placeholder="16">
        </div>
        <div class="field">
          <label>SpO2 (%)*</label>
          <input type="number" formControlName="oxygenSaturation" placeholder="98">
        </div>
        <div class="field">
          <label>Pain Level (0-10)</label>
          <input type="range" min="0" max="10" formControlName="painLevel">
          <div class="text-xs text-center font-bold">{{admissionForm().get('vitals.painLevel')?.value}} / 10</div>
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">stethoscope</span>
        <h3>Systems Review</h3>
      </div>
      <div class="grid-layout">
        <div class="field">
          <label>Consciousness</label>
          <select formControlName="consciousnessLevel">
            <option value="Alert">Alert & Oriented</option>
            <option value="Drowsy">Drowsy</option>
            <option value="Confused">Confused</option>
            <option value="Unconscious">Unconscious</option>
          </select>
        </div>
        <div class="field">
          <label>Pupils Reaction</label>
          <select formControlName="pupilsReaction">
            <option value="Normal">PERRLA</option>
            <option value="Sluggish">Sluggish</option>
            <option value="Dilated">Dilated</option>
          </select>
        </div>
        <div class="field">
          <label>Skin Turgor</label>
          <select formControlName="skinTurgor">
            <option value="Normal">Normal</option>
            <option value="Tented">Tented</option>
            <option value="Dry">Dry / Flaky</option>
          </select>
        </div>
        <div class="field">
          <label>Edema Presence</label>
          <select formControlName="edemaPresence">
            <option value="None">None</option>
            <option value="Pitting">Pitting</option>
            <option value="Non-pitting">Non-pitting</option>
          </select>
        </div>
        <div class="field">
          <label>Heart Sounds</label>
          <input type="text" formControlName="heartSounds" placeholder="e.g. S1, S2 audible">
        </div>
        <div class="field">
          <label>Lung Sounds</label>
          <input type="text" formControlName="lungSounds" placeholder="e.g. Clear bilat">
        </div>
        <div class="field">
          <label>Abdominal Sounds</label>
          <input type="text" formControlName="abdominalSounds" placeholder="e.g. Normoactive">
        </div>
        <div class="field">
          <label>Mobility Status</label>
          <select formControlName="mobilityStatus">
            <option value="Independent">Independent</option>
            <option value="Assistive">Needs Assistive Device</option>
            <option value="Bedridden">Bedridden</option>
          </select>
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">assignment_ind</span>
        <h3>Admission Tracking</h3>
      </div>
      <div class="grid-layout">
        <div class="field">
          <label>Mode of Arrival</label>
          <select formControlName="modeOfArrival">
            <option value="Walk-in">Walk-in</option>
            <option value="Ambulance">Ambulance</option>
            <option value="Referral">Physician Referral</option>
          </select>
        </div>
        <div class="field">
          <label>Nurse Assigned</label>
          <input type="text" formControlName="nurseAssigned" placeholder="Nurse Name">
        </div>
        <div class="field">
          <label>Attending Doctor</label>
          <input type="text" formControlName="doctorAssigned" placeholder="Doctor Name">
        </div>
        <div class="field">
          <label>Ward / Department</label>
          <select formControlName="wardDepartment">
            <option value="General">General Medicine</option>
            <option value="ICU">ICU</option>
            <option value="Emergency">Emergency</option>
            <option value="Surgical">Surgical</option>
          </select>
        </div>
        <div class="field d-flex align-items-center mt-3">
          <label class="checkbox-item mb-0"><input type="checkbox" formControlName="patientIdVerified"> ID Verified</label>
        </div>
        <div class="field d-flex align-items-center mt-3">
          <label class="checkbox-item mb-0"><input type="checkbox" formControlName="valuablesStored"> Valuables Stored</label>
        </div>
      </div>
    </div>
  `,
  styleUrl: './admission.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VitalsSection {
  private controlContainer = inject(ControlContainer);

  admissionForm() {
    return this.controlContainer.control as any;
  }
}
