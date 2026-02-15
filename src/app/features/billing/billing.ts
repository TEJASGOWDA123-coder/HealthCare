import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BillingService } from '../../core/services/billing.service';
import { Invoice } from '../../core/models/invoice.model';


@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class Billing implements OnInit {
  private billing = inject(BillingService);
  invoices = signal<Invoice[]>([]);
  loading = signal(false);
  stats = signal<any>({
    totalCollected: 0,
    outstanding: 0,
    pending: 0
  });

  ngOnInit() {
    this.loadInvoices();
    this.loadStats();
  }

  private loadInvoices() {
    this.loading.set(true);
    this.billing.getInvoices().subscribe({
      next: (data) => {
        this.invoices.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching invoices', err);
        this.loading.set(false);
      }
    });
  }

  private loadStats() {
    this.billing.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
      },
      error: (err) => {
        console.error('Error fetching stats', err);
      }
    });
  }

  deleteInvoice(id: string) {
    if (confirm('Are you sure you want to delete this invoice?')) {
      this.billing.deleteInvoice(id).subscribe({
        next: () => {
          this.loadInvoices();
          this.loadStats(); // Refresh stats after deletion
        },
        error: (err: any) => console.error('Error deleting invoice', err)
      });
    }
  }

  download(id: string) {
    this.billing.downloadPdf(id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error downloading PDF', err)
    });
  }

  searchTerm = signal('');

  filteredInvoices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const all = this.invoices();
    if (!term) return all;
    return all.filter(i =>
      i.patientName.toLowerCase().includes(term) ||
      i.invoiceNumber.toLowerCase().includes(term)
    );
  });

  totalOutstanding = computed(() =>
    this.invoices()
      .filter(i => i.status !== 'Paid')
      .reduce((acc, curr) => acc + curr.amount, 0)
  );

  getStatusClass(status: string): string {
    const s = status.toLowerCase();
    switch (s) {
      case 'paid': return 'status-green';
      case 'pending': return 'status-yellow';
      case 'overdue': return 'status-red';
      default: return '';
    }
  }
}
