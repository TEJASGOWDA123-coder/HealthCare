package com.mednex.laboratory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LabRequestRepository extends JpaRepository<LabRequest, Long> {
    List<LabRequest> findByPatientId(Long patientId);

    List<LabRequest> findByStatus(String status);
}
