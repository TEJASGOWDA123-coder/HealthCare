package com.mednex.billing;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PdfService {

    public byte[] generateInvoicePdf(Invoice invoice) throws Exception {

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document doc = new Document(pdf);

        doc.add(new Paragraph("MedNex Hospital Invoice")
                .setBold().setFontSize(18));

        doc.add(new Paragraph("Invoice #: " + invoice.getInvoiceNumber()));
        doc.add(new Paragraph("Patient: " + invoice.getPatientName()));
        doc.add(new Paragraph("Date: " + invoice.getDate()));
        doc.add(new Paragraph("Method: " + invoice.getMethod()));
        doc.add(new Paragraph("Amount: $" + invoice.getAmount()));
        doc.add(new Paragraph("Status: " + invoice.getStatus()));

        doc.close();

        return out.toByteArray();
    }
}
