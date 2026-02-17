package com.mednex.billing;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/invoices")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class InvoiceController {

    private final InvoiceService invoiceService;
    private final PdfService pdfService;
    private final QrService qrService;

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAll());
    }

    @GetMapping("/{invoiceNumber}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable String invoiceNumber) {
        return invoiceService.getAll().stream()
                .filter(i -> i.getInvoiceNumber().equals(invoiceNumber))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        return ResponseEntity.ok(invoiceService.save(invoice));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable Long id) {
        invoiceService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<BillingStats> stats() {
        return ResponseEntity.ok(invoiceService.stats());
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> download(@PathVariable Long id) throws Exception {

        Invoice invoice = invoiceService.getById(id);
        byte[] pdf = pdfService.generateInvoicePdf(invoice);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=invoice.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

    @GetMapping("/{id}/qr")
    public ResponseEntity<byte[]> qr(@PathVariable Long id) throws Exception {

        String paymentUrl = "http://10.148.245.236:8080/api/v1/invoices/pay/" + id;

        byte[] qr = qrService.generateQr(paymentUrl);

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(qr);
    }

    @GetMapping(value = "/pay/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public String paymentPage(@PathVariable Long id) {

        return """
                <html>
                <body style='font-family:sans-serif;text-align:center;margin-top:50px'>
                  <h2>MedNex Payment</h2>
                  <p>Invoice #%d</p>
                  <form method='post' action='/api/v1/invoices/%d/pay/web'>
                    <button style='padding:12px 20px;font-size:18px;background-color:#4CAF50;color:white;border:none;cursor:pointer'>
                      Confirm Payment
                    </button>
                  </form>
                </body>
                </html>
                """
                .formatted(id, id);
    }

    @PostMapping("/{id}/pay")
    public Invoice markPaid(@PathVariable Long id) {

        Invoice invoice = invoiceService.getById(id);
        invoice.setStatus("PAID");

        return invoiceService.save(invoice);
    }

    @PostMapping(value = "/{id}/pay/web", produces = MediaType.TEXT_HTML_VALUE)
    public String webPay(@PathVariable Long id) {
        markPaid(id);
        return """
                <html>
                <body style='font-family:sans-serif;text-align:center;margin-top:50px'>
                  <h2 style='color:green'>Payment Successful!</h2>
                  <p>Thank you for your payment.</p>
                  <a href='/api/v1/invoices/%d/pdf'>
                    <button style='padding:12px 20px;font-size:18px;background-color:#008CBA;color:white;border:none;cursor:pointer'>
                      Download Receipt (PDF)
                    </button>
                  </a>
                </body>
                </html>
                """
                .formatted(id);
    }
}
