package com.mednex.billing;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository repo;

    public InvoiceService(InvoiceRepository repo) {
        this.repo = repo;
    }

    public List<Invoice> getAll() {
        return repo.findAll();
    }

    public Invoice save(Invoice invoice) {
        return repo.save(invoice);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public BillingStats stats() {
        Double collected = repo.totalCollected();
        Double overdue = repo.outstanding();
        Double pending = repo.pending();

        return new BillingStats(
                collected != null ? collected : 0.0,
                overdue != null ? overdue : 0.0,
                pending != null ? pending : 0.0);
    }

    public Invoice getById(Long id) {
        return repo.findById(id).orElseThrow();
    }
}
