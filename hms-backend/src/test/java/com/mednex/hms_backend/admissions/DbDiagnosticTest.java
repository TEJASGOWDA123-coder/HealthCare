package com.mednex.hms_backend.admissions;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;
import java.util.Map;

@SpringBootTest
public class DbDiagnosticTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void diagnoseDb() {
        System.out.println("--- DB Diagnostic Starting ---");

        try {
            // Find current database
            String dbName = jdbcTemplate.queryForObject("SELECT current_database()", String.class);
            System.out.println("🔍 Current Database: " + dbName);

            // List all databases
            List<String> dbs = jdbcTemplate.queryForList("SELECT datname FROM pg_database WHERE datistemplate = false",
                    String.class);
            System.out.println("🌐 All Databases: " + dbs);

            // List schemas
            List<String> schemas = jdbcTemplate.queryForList(
                    "SELECT schema_name FROM information_schema.schemata WHERE schema_name NOT LIKE 'pg_%' AND schema_name != 'information_schema'",
                    String.class);
            System.out.println("📁 Schemas found: " + schemas);

            // List tables in each schema
            for (String schema : schemas) {
                List<String> tables = jdbcTemplate.queryForList(
                        "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
                        String.class,
                        schema);
                System.out.println("   📄 Tables in " + schema + ": " + tables);

                if (tables.contains("admissions")) {
                    Long count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM " + schema + ".admissions",
                            Long.class);
                    System.out.println("   📊 Row count in " + schema + ".admissions: " + count);
                }
            }

        } catch (Exception e) {
            System.err.println("❌ Diagnostic failed: " + e.getMessage());
            e.printStackTrace();
        }

        System.out.println("--- DB Diagnostic Complete ---");
    }
}
