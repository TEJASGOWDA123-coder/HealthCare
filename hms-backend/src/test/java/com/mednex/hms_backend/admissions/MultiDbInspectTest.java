package com.mednex.hms_backend.admissions;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

@SpringBootTest
public class MultiDbInspectTest {

    @Test
    public void inspectOtherDbs() {
        String[] dbs = { "db_a", "db_b", "postgres", "mednex" };
        for (String db : dbs) {
            System.out.println("🔍 Inspecting Database: " + db);
            String url = "jdbc:postgresql://localhost:5432/" + db;
            try (Connection conn = DriverManager.getConnection(url, "postgres", "123");
                    Statement stmt = conn.createStatement()) {

                ResultSet rs = stmt
                        .executeQuery("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
                while (rs.next()) {
                    String tableName = rs.getString("table_name");
                    if ("admissions".equals(tableName)) {
                        try (Statement stmt2 = conn.createStatement();
                                ResultSet rs2 = stmt2.executeQuery("SELECT COUNT(*) FROM public.admissions")) {
                            if (rs2.next()) {
                                System.out.println("   ✅ Found admissions table! Count: " + rs2.getLong(1));
                                // Dump one row if exists
                                if (rs2.getLong(1) > 0) {
                                    try (ResultSet rs3 = stmt2
                                            .executeQuery("SELECT id, patient_name FROM public.admissions LIMIT 1")) {
                                        if (rs3.next()) {
                                            System.out.println("      🆔 Sample ID: " + rs3.getLong("id") + " | Name: "
                                                    + rs3.getString("patient_name"));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("   ❌ Could not connect or query: " + e.getMessage());
            }
        }
    }
}
