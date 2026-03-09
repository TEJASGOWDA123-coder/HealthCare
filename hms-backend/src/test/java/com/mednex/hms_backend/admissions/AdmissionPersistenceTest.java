package com.mednex.hms_backend.admissions;

import com.mednex.hms_backend.admissions.model.entity.Admission;
import com.mednex.hms_backend.admissions.repository.AdmissionRepository;
import com.mednex.hms_backend.config.TenantContext;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class AdmissionPersistenceTest {

    @Autowired
    private AdmissionRepository admissionRepository;

    @Test
    public void testSaveAdmission() {
        TenantContext.setTenant("tenantA");
        try {
            Admission admission = Admission.builder()
                    .patientId(1L)
                    .patientName("Test Patient")
                    .admissionDate(LocalDate.now())
                    .roomNumber("101-Test")
                    .doctorInCharge("Dr. Test")
                    .medicalHistory("{\"test\": true}")
                    .build();

            Admission saved = admissionRepository.save(admission);
            assertThat(saved.getId()).isNotNull();

            System.out.println("✅ Saved Admission ID: " + saved.getId());
        } finally {
            TenantContext.clear();
        }
    }
}
