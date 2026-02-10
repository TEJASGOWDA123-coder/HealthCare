import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Invoice {
  id: string;
  patientName: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  method: 'Insurance' | 'Credit Card' | 'Cash' | 'Bank Transfer';
}

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class Billing {
  invoices = signal<Invoice[]>([
    { id: 'INV-2001', patientName: 'Johnathan Abernathy', date: '2024-02-08', amount: 1250.00, status: 'Paid', method: 'Insurance' },
    { id: 'INV-2002', patientName: 'Sarah Montgomery', date: '2024-02-10', amount: 8400.00, status: 'Pending', method: 'Insurance' },
    { id: 'INV-2003', patientName: 'Robert Chen', date: '2024-02-05', amount: 150.00, status: 'Paid', method: 'Cash' },
    { id: 'INV-2004', patientName: 'Emma Thompson', date: '2024-01-28', amount: 2450.00, status: 'Overdue', method: 'Credit Card' },
    { id: 'INV-2005', patientName: 'Michael Rodriguez', date: '2024-02-09', amount: 450.00, status: 'Paid', method: 'Bank Transfer' },
    { id: 'INV-2006', patientName: 'Alice Walker', date: '2024-02-01', amount: 310.00, status: 'Paid', method: 'Credit Card' },
  ]);

  stats = signal({
    totalCollected: 42850.00,
    outstandingBalance: 0.00,
    pendingClaims: 12400.00
  });

  searchTerm = signal('');

  filteredInvoices = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const all = this.invoices();
    if (!term) return all;
    return all.filter(i =>
      i.patientName.toLowerCase().includes(term) ||
      i.id.toLowerCase().includes(term)
    );
  });

  totalOutstanding = computed(() =>
    this.invoices()
      .filter(i => i.status !== 'Paid')
      .reduce((acc, curr) => acc + curr.amount, 0)
  );

  getStatusClass(status: string): string {
    switch (status) {
      case 'Paid': return 'status-green';
      case 'Pending': return 'status-yellow';
      case 'Overdue': return 'status-red';
      default: return '';
    }
  }
}
