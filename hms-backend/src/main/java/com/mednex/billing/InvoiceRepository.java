package com.mednex.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.status='PAID'")
    Double totalCollected();

    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.status='OVERDUE'")
    Double outstanding();

    @Query("SELECT SUM(i.amount) FROM Invoice i WHERE i.status='PENDING'")
    Double pending();
}
