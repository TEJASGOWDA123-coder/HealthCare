package com.mednex.billing;

public record BillingStats(
        Double totalCollected,
        Double outstanding,
        Double pending) {
}
