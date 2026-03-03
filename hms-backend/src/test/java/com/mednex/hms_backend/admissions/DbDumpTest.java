package com.mednex.hms_backend.admissions;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@SpringBootTest
public class DbDumpTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void dumpAdmissions() {
        System.out.println("--- Global Admission Dump ---");

        List<String> schemas = jdbcTemplate.queryForList(
                "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema'",
                String.class);

        for (String schema : schemas) {
            try {
                List<Map<String, Object>> rows = jdbcTemplate
                        .queryForList("SELECT * FROM " + schema + ".admissions ORDER BY id DESC LIMIT 5");
                System.out.println("📁 Schema: " + schema + " | Total Count: "
                        + jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + schema + ".admissions", Long.class));
                for (Map<String, Object> row : rows) {
                    System.out.println("   🆔 ID: " + row.get("id") + " | Patient: " + row.get("patient_name")
                            + " | Date: " + row.get("admission_date") + " | CreatedAt: " + row.get("created_at"));
                }
            } catch (Exception e) {
                // Table might not exist in this schema
            }
        }

        System.out.println("--- End of Dump ---");
    }
}
