import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BillingService } from '../../../core/services/billing.service';

@Component({
    selector: 'app-invoice-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './invoice-form.html',
    styleUrl: './invoice-form.scss'
})
export class InvoiceFormComponent {
    private fb = inject(FormBuilder);
    private billing = inject(BillingService);
    private router = inject(Router);

    form = this.fb.group({
        invoiceNumber: ['', Validators.required],
        patientName: ['', Validators.required],
        date: ['', Validators.required],
        method: ['Cash'],
        amount: [0, [Validators.required, Validators.min(0)]],
        status: ['PENDING']
    });

    submit() {
        if (this.form.valid) {
            this.billing.createInvoice(this.form.value)
                .subscribe(() => this.router.navigate(['/billing']));
        }
    }

}
