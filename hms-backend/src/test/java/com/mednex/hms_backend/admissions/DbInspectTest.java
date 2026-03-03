package com.mednex.hms_backend.admissions;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@SpringBootTest
public class DbInspectTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void inspectAdmissions() {
        System.out.println("--- Admission Data Inspection ---");
        try {
            List<Map<String, Object>> rows = jdbcTemplate.queryForList("SELECT * FROM public.admissions");
            System.out.println("🔍 Total Rows: " + rows.size());
            for (Map<String, Object> row : rows) {
                System.out.println("📍 ID: " + row.get("id") + ", Patient: " + row.get("patient_name") + ", Created: "
                        + row.get("created_at"));
                // System.out.println(" Data: " + row.get("medical_history"));
            }
        } catch (Exception e) {
            System.err.println("❌ Inspection failed: " + e.getMessage());
        }
        System.out.println("--- End of Inspection ---");
    }
}
