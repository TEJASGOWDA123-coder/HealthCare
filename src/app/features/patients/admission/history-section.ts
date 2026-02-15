import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlContainer, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-history-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  viewProviders: [{ provide: ControlContainer, useFactory: () => inject(ControlContainer, { skipSelf: true }) }],
  template: `
    <div class="form-section" formGroupName="medicalHistory">
      <div class="section-header">
        <span class="material-icons-round">history_edu</span>
        <h3>Clinical History</h3>
      </div>
      
      <div class="grid-layout">
        <div class="field full-width">
          <label>Previous Surgeries</label>
          <textarea formControlName="previousSurgeries" placeholder="List procedures and years..."></textarea>
        </div>
        <div class="field full-width">
          <label>Previous Hospitalizations</label>
          <textarea formControlName="previousHospitalizations" placeholder="Non-surgical hospital stays..."></textarea>
        </div>
        
        <div class="field">
          <label>Drug Allergies</label>
          <input type="text" formControlName="drugAllergies" placeholder="e.g. Penicillin">
        </div>
        <div class="field">
          <label>Food Allergies</label>
          <input type="text" formControlName="foodAllergies" placeholder="e.g. Peanuts">
        </div>
        <div class="field">
          <label>Environmental Allergies</label>
          <input type="text" formControlName="environmentalAllergies" placeholder="e.g. Latex, Pollen">
        </div>
        
        <div class="field full-width">
          <label>Current Medications</label>
          <textarea formControlName="currentMedications" placeholder="Name, dosage, and frequency..."></textarea>
        </div>
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">family_restroom</span>
        <h3>Family History</h3>
      </div>
      <div class="checkbox-grid">
        <label class="checkbox-item"><input type="checkbox" formControlName="familyHistoryHeart"> Heart Disease</label>
        <label class="checkbox-item"><input type="checkbox" formControlName="familyHistoryDiabetes"> Diabetes</label>
        <label class="checkbox-item"><input type="checkbox" formControlName="familyHistoryCancer"> Cancer</label>
        <label class="checkbox-item"><input type="checkbox" formControlName="familyHistoryHypertension"> Hypertension</label>
        <label class="checkbox-item"><input type="checkbox" formControlName="familyHistoryStroke"> Stroke</label>
      </div>
      <div class="field mt-2">
        <label>Other Family History</label>
        <input type="text" formControlName="familyHistoryOther" placeholder="Specify other conditions">
      </div>

      <div class="section-header mt-4">
        <span class="material-icons-round">psychology</span>
        <h3>Social History & Habits</h3>
      </div>
      <div class="grid-layout">
        <div class="field">
          <label>Tobacco Use</label>
          <select formControlName="tobaccoUse">
            <option value="Never">Never</option>
            <option value="Former">Former</option>
            <option value="Current">Current</option>
          </select>
        </div>
        <div class="field">
          <label>Alcohol Use</label>
          <select formControlName="alcoholUse">
            <option value="Never">Never</option>
            <option value="Occasional">Occasional</option>
            <option value="Frequent">Frequent</option>
          </select>
        </div>
        <div class="field">
          <label>Exercise Frequency</label>
          <input type="text" formControlName="exerciseFrequency" placeholder="e.g. 3x weekly">
        </div>
        <div class="field full-width">
          <label>Recent Travel History (Last 30 Days)</label>
          <input type="text" formControlName="travelHistoryRecent" placeholder="List locations visited">
        </div>
      </div>
    </div>
  `,
  styleUrl: './admission.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistorySection { }
