package com.hms.app.repository;

import com.hms.app.entity.MedicalRecord;
import com.hms.app.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    List<MedicalRecord> findByPatient(Patient patient);

    // ✅ ADDED: Count medical records for a patient
    int countByPatient(Patient patient);
}
