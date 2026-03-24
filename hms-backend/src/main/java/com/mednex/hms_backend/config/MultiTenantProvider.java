package com.mednex.hms_backend.config;

import org.hibernate.engine.jdbc.connections.spi.MultiTenantConnectionProvider;
import org.springframework.stereotype.Component;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

@Component
public class MultiTenantProvider
        implements MultiTenantConnectionProvider<String> {

    @Override
    public Connection getConnection(String tenantIdentifier) throws SQLException {
        String url = "jdbc:postgresql://localhost:5432/mednex";
        System.out.println("🔍 MultiTenantProvider: Requested connection for tenant - " + tenantIdentifier);

        Connection connection = DriverManager.getConnection(url, "postgres", "123");
        try (var statement = connection.createStatement()) {
            String schema = tenantIdentifier != null ? tenantIdentifier : "public";

            // Provision schema if it doesn't exist
            statement.execute("CREATE SCHEMA IF NOT EXISTS " + schema);

            // Set search path (including public as fallback for common tables)
            statement.execute("SET search_path TO " + schema + ", public");
            System.out.println("🔌 MultiTenantProvider: Search path set to - " + schema + ", public");
        } catch (SQLException e) {
            connection.close();
            throw e;
        }
        return connection;
    }

    @Override
    public Connection getAnyConnection() throws SQLException {
        return getConnection("tenantA");
    }

    @Override
    public void releaseConnection(String tenantIdentifier, Connection connection) throws SQLException {
        connection.close();
    }

    @Override
    public void releaseAnyConnection(Connection connection) throws SQLException {
        connection.close();
    }

    @Override
    public boolean supportsAggressiveRelease() {
        return false;
    }

    @Override
    public boolean isUnwrappableAs(Class<?> unwrapType) {
        return false;
    }

    @Override
    public <T> T unwrap(Class<T> unwrapType) {
        return null;
    }
}
