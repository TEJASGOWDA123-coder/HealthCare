package com.mednex.hms_backend.config.seed;

import com.mednex.billing.Invoice;
import com.mednex.billing.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;

import java.time.LocalDate;
import java.util.Arrays;

@RequiredArgsConstructor
public class BillingSeeder implements CommandLineRunner {

    private final InvoiceRepository invoiceRepository;

    @Override
    public void run(String... args) {
        if (invoiceRepository.count() == 0) {
            invoiceRepository.saveAll(Arrays.asList(
                    Invoice.builder()
                            .invoiceNumber("INV-2001")
                            .patientName("Johnathan Abernathy")
                            .date(LocalDate.of(2024, 2, 8))
                            .amount(1250.00)
                            .status("Paid")
                            .method("Insurance")
                            .build(),
                    Invoice.builder()
                            .invoiceNumber("INV-2002")
                            .patientName("Sarah Montgomery")
                            .date(LocalDate.of(2024, 2, 10))
                            .amount(8400.00)
                            .status("Pending")
                            .method("Insurance")
                            .build(),
                    Invoice.builder()
                            .invoiceNumber("INV-2003")
                            .patientName("Robert Chen")
                            .date(LocalDate.of(2024, 2, 5))
                            .amount(150.00)
                            .status("Paid")
                            .method("Cash")
                            .build(),
                    Invoice.builder()
                            .invoiceNumber("INV-2004")
                            .patientName("Emma Thompson")
                            .date(LocalDate.of(2024, 1, 28))
                            .amount(2450.00)
                            .status("Overdue")
                            .method("Credit Card")
                            .build(),
                    Invoice.builder()
                            .invoiceNumber("INV-2005")
                            .patientName("Michael Rodriguez")
                            .date(LocalDate.of(2024, 2, 9))
                            .amount(450.00)
                            .status("Paid")
                            .method("Bank Transfer")
                            .build(),
                    Invoice.builder()
                            .invoiceNumber("INV-2006")
                            .patientName("Alice Walker")
                            .date(LocalDate.of(2024, 2, 1))
                            .amount(310.00)
                            .status("Paid")
                            .method("Credit Card")
                            .build(),
                    Invoice.builder()
                            .invoiceNumber("INV-2007")
                            .patientName("David Miller")
                            .date(LocalDate.of(2024, 2, 11))
                            .amount(15000.00)
                            .status("Paid")
                            .method("Insurance")
                            .build()));
            System.out.println("✅ Seeded Billing Data");
        }
    }
}
