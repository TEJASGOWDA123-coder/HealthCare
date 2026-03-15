package com.mednex.laboratory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LabResultRepository extends JpaRepository<LabResult, Long> {
    LabResult findByRequestId(Long requestId);
}
