package com.mednex.hms_backend.patients.controller;

import com.itextpdf.kernel.pdf.EncryptionConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.WriterProperties;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.mednex.hms_backend.patients.model.dto.PatientDto;
import com.mednex.hms_backend.patients.service.PatientService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/patients")
public class PatientExportController {

    private final PatientService patientService;

    public PatientExportController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping("/{id}/export-pdf")
    public void exportToPdf(@PathVariable Long id, HttpServletResponse response) throws IOException {
        PatientDto patient = patientService.getPatientById(id);

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=patient_history_" + id + ".pdf");

        // Use patient email as password for demonstration
        byte[] userPassword = patient.getEmail().getBytes();
        byte[] ownerPassword = "admin-secret-password".getBytes();

        WriterProperties props = new WriterProperties()
                .setStandardEncryption(userPassword, ownerPassword,
                        EncryptionConstants.ALLOW_PRINTING, EncryptionConstants.ENCRYPTION_AES_128);

        PdfWriter writer = new PdfWriter(response.getOutputStream(), props);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Patient Medical History").setBold().setFontSize(18));
        document.add(new Paragraph("Full Name: " + patient.getFirstName() + " " + patient.getLastName()));
        document.add(new Paragraph("Email: " + patient.getEmail()));
        document.add(new Paragraph("Phone: " + patient.getPhoneNumber()));
        document.add(new Paragraph("Gender: " + patient.getGender()));
        document.add(new Paragraph("Address: " + patient.getAddress()));

        document.add(new Paragraph("\nDiagnosis & Treatment Notes:"));
        document.add(new Paragraph(patient.getMedicalHistory() != null ? patient.getMedicalHistory().toString()
                : "No history available."));

        document.close();
    }
}
