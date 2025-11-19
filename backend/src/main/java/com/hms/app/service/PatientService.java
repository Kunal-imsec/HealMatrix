package com.hms.app.service;

import com.hms.app.entity.Patient;
import java.util.List;
import java.util.Optional;

public interface PatientService {
    Patient savePatient(Patient patient);
    List<Patient> getAllPatients();
    Optional<Patient> getPatientById(Long id);
    Patient updatePatient(Long id, Patient patientDetails); // Changed return type
    void deletePatient(Long id); // Changed return type
}
