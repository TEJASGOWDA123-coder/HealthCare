import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debounceTime, switchMap, of, catchError } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface Doctor {
  id: number;
  fullName: string;
  email: string;
  specialization: string;
}

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
        <div class="field" [class.invalid]="admissionForm().get('vitals.height')?.invalid && admissionForm().get('vitals.height')?.touched">
          <label>Height (cm)*</label>
          <input type="number" formControlName="height" placeholder="e.g. 175">
          <div class="error-message" *ngIf="admissionForm().get('vitals.height')?.invalid && admissionForm().get('vitals.height')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('vitals.weight')?.invalid && admissionForm().get('vitals.weight')?.touched">
          <label>Weight (kg)*</label>
          <input type="number" formControlName="weight" placeholder="e.g. 70">
          <div class="error-message" *ngIf="admissionForm().get('vitals.weight')?.invalid && admissionForm().get('vitals.weight')?.touched">Required</div>
        </div>
        <div class="field">
          <label>BMI</label>
          <input type="number" formControlName="bmi" readonly placeholder="Calculated">
        </div>
        <div class="field" [class.invalid]="admissionForm().get('vitals.bloodPressure')?.invalid && admissionForm().get('vitals.bloodPressure')?.touched">
          <label>Blood Pressure*</label>
          <input type="text" formControlName="bloodPressure" placeholder="120/80">
          <div class="error-message" *ngIf="admissionForm().get('vitals.bloodPressure')?.invalid && admissionForm().get('vitals.bloodPressure')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('vitals.temperature')?.invalid && admissionForm().get('vitals.temperature')?.touched">
          <label>Temp (°C)*</label>
          <input type="number" step="0.1" formControlName="temperature" placeholder="36.6">
          <div class="error-message" *ngIf="admissionForm().get('vitals.temperature')?.invalid && admissionForm().get('vitals.temperature')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('vitals.pulseRate')?.invalid && admissionForm().get('vitals.pulseRate')?.touched">
          <label>Pulse (BPM)*</label>
          <input type="number" formControlName="pulseRate" placeholder="72">
          <div class="error-message" *ngIf="admissionForm().get('vitals.pulseRate')?.invalid && admissionForm().get('vitals.pulseRate')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('vitals.respiratoryRate')?.invalid && admissionForm().get('vitals.respiratoryRate')?.touched">
          <label>Resp Rate*</label>
          <input type="number" formControlName="respiratoryRate" placeholder="16">
          <div class="error-message" *ngIf="admissionForm().get('vitals.respiratoryRate')?.invalid && admissionForm().get('vitals.respiratoryRate')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('vitals.oxygenSaturation')?.invalid && admissionForm().get('vitals.oxygenSaturation')?.touched">
          <label>SpO2 (%)*</label>
          <input type="number" formControlName="oxygenSaturation" placeholder="98">
          <div class="error-message" *ngIf="admissionForm().get('vitals.oxygenSaturation')?.invalid && admissionForm().get('vitals.oxygenSaturation')?.touched">Required</div>
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

        <!-- Chief Complaint with Smart Suggest -->
        <div class="field full-width" [class.invalid]="admissionForm().get('vitals.chiefComplaint')?.invalid && admissionForm().get('vitals.chiefComplaint')?.touched">
          <label>Chief Complaint* <span class="hint">(type to get a doctor suggestion)</span></label>
          <textarea formControlName="chiefComplaint" placeholder="Describe the patient's reason for admission..."
            (input)="onComplaintInput($event)"></textarea>
          <div class="error-message" *ngIf="admissionForm().get('vitals.chiefComplaint')?.invalid && admissionForm().get('vitals.chiefComplaint')?.touched">Required</div>

          <!-- Smart Suggestion Banner -->
          <div class="suggestion-banner" *ngIf="suggestedDoctor()">
            <span class="material-icons-round">auto_awesome</span>
            <div class="suggestion-info">
              <span class="suggestion-label">Suggested Specialist</span>
              <strong>{{ suggestedDoctor()!.fullName }}</strong>
              <span class="specialty-chip">{{ suggestedDoctor()!.specialization }}</span>
            </div>
            <button type="button" class="assign-btn" (click)="assignSuggestedDoctor()">Assign</button>
          </div>
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

        <!-- Dynamic Doctor Dropdown -->
        <div class="field">
          <label>Attending Doctor <span class="hint">({{ doctors().length }} available)</span></label>
          <select formControlName="doctorAssigned" (change)="onDoctorDropdownChange($event)">
            <option value="">-- Select Doctor --</option>
            <option *ngFor="let doc of doctors()" [value]="doc.fullName">
              {{ doc.fullName }} — {{ doc.specialization }}
            </option>
          </select>
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
        <div class="field" [class.invalid]="admissionForm().get('vitals.roomNumber')?.invalid && admissionForm().get('vitals.roomNumber')?.touched">
          <label>Room Number*</label>
          <input type="text" formControlName="roomNumber" placeholder="e.g. 302-A">
          <div class="error-message" *ngIf="admissionForm().get('vitals.roomNumber')?.invalid && admissionForm().get('vitals.roomNumber')?.touched">Required</div>
        </div>
        <div class="field" [class.invalid]="admissionForm().get('vitals.admissionDate')?.invalid && admissionForm().get('vitals.admissionDate')?.touched">
          <label>Admission Date*</label>
          <input type="date" formControlName="admissionDate">
          <div class="error-message" *ngIf="admissionForm().get('vitals.admissionDate')?.invalid && admissionForm().get('vitals.admissionDate')?.touched">Required</div>
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
  styles: [`
    .hint { font-size: 0.7rem; color: #64748b; font-weight: 400; }
    .full-width { grid-column: 1 / -1; }
    .suggestion-banner {
      display: flex; align-items: center; gap: 0.75rem;
      background: linear-gradient(135deg, #ecfdf5, #d1fae5);
      border: 1px solid #6ee7b7; border-radius: 10px;
      padding: 0.75rem 1rem; margin-top: 0.5rem;
    }
    .suggestion-banner .material-icons-round { color: #059669; font-size: 1.25rem; }
    .suggestion-info { display: flex; flex-direction: column; gap: 0.15rem; flex: 1; }
    .suggestion-label { font-size: 0.7rem; color: #059669; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .specialty-chip {
      display: inline-block; background: #059669; color: white;
      font-size: 0.65rem; padding: 2px 8px; border-radius: 20px; font-weight: 600;
    }
    .assign-btn {
      background: #059669; color: white; border: none; border-radius: 8px;
      padding: 0.4rem 1rem; cursor: pointer; font-weight: 600; font-size: 0.8rem;
      transition: background 0.2s;
    }
    .assign-btn:hover { background: #047857; }
  `],
  styleUrl: './admission.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VitalsSection implements OnInit {
  private controlContainer = inject(ControlContainer);
  private http = inject(HttpClient);

  doctors = signal<Doctor[]>([]);
  suggestedDoctor = signal<Doctor | null>(null);

  private readonly API = `${environment.apiBaseUrl}/api/v1`;

  admissionForm() {
    return this.controlContainer.control as any;
  }

  ngOnInit() {
    this.loadDoctors();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  loadDoctors() {
    this.http.get<Doctor[]>(`${this.API}/doctors`, { headers: this.getAuthHeaders() })
      .pipe(catchError(() => of([])))
      .subscribe(docs => this.doctors.set(docs));
  }

  onComplaintInput(event: Event) {
    const complaint = (event.target as HTMLTextAreaElement).value;
    if (complaint.length < 3) {
      this.suggestedDoctor.set(null);
      return;
    }
    this.http.get<any>(`${this.API}/doctors/suggest?complaint=${encodeURIComponent(complaint)}`, { headers: this.getAuthHeaders() })
      .pipe(catchError(() => of(null)))
      .subscribe(result => {
        if (result && result.id) {
          this.suggestedDoctor.set(result as Doctor);
        } else {
          this.suggestedDoctor.set(null);
        }
      });
  }

  assignSuggestedDoctor() {
    const doc = this.suggestedDoctor();
    if (!doc) return;
    this.admissionForm().get('vitals.doctorAssigned')?.setValue(doc.fullName);
    this.admissionForm().get('vitals.assignedDoctorId')?.setValue(doc.id);
  }

  onDoctorDropdownChange(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value;
    const found = this.doctors().find(d => d.fullName === selectedName);
    if (found) {
      this.admissionForm().get('vitals.assignedDoctorId')?.setValue(found.id);
    } else {
      this.admissionForm().get('vitals.assignedDoctorId')?.setValue(null);
    }
  }
}
