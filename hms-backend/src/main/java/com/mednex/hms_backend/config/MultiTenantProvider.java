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

        String url;

        System.out.println("🔍 MultiTenantProvider: Requested connection for tenant - " + tenantIdentifier);

        if ("tenantA".equals(tenantIdentifier)) {
            url = "jdbc:postgresql://localhost:5432/mednex";
        } else {
            url = "jdbc:postgresql://localhost:5432/mednex";
        }

        System.out.println("🔌 MultiTenantProvider: Connecting to - " + url);
        return DriverManager.getConnection(url, "postgres", "123");
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
