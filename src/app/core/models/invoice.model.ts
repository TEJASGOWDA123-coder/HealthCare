export interface Invoice {
    id: string;
    invoiceNumber: string;
    patientName: string;
    date: string;
    method: string;
    amount: number;
    status: string;
}
