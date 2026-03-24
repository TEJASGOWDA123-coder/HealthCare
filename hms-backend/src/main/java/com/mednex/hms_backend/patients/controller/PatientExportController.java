package com.mednex.hms_backend.patients.controller;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
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
@org.springframework.web.bind.annotation.CrossOrigin(origins = "*")
public class PatientExportController {

    private final PatientService patientService;
    private final com.mednex.hms_backend.activity.AuditLogService auditLogService;

    public PatientExportController(PatientService patientService,
            com.mednex.hms_backend.activity.AuditLogService auditLogService) {
        this.patientService = patientService;
        this.auditLogService = auditLogService;
    }

    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_DOCTOR')")
    @GetMapping("/{id}/export-pdf")
    public void exportToPdf(@PathVariable Long id, HttpServletResponse response) throws IOException {
        PatientDto patient = patientService.getPatientById(id);

        // Security check: Only allow export if searching for authorized patient (simple
        // version)
        // Audit log export action
        String currentUser = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getName();
        auditLogService.log(currentUser, id.toString(), "EXPORT_PDF", "Exported patient medical history to PDF");

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=patient_history_" + id + ".pdf");

        PdfWriter writer = new PdfWriter(response.getOutputStream());
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
