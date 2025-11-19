package com.hms.app.service.impl;

import com.hms.app.entity.Patient;
import com.hms.app.exception.ResourceNotFoundException;
import com.hms.app.repository.PatientRepository;
import com.hms.app.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements PatientService {

    private final PatientRepository patientRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Patient> getAllPatients() {
        log.info("Fetching all patients from database");
        List<Patient> patients = patientRepository.findAllWithUser();  // ✅ Eager fetch user data
        log.info("Found {} patients", patients.size());
        return patients;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Patient> getPatientById(Long id) {
        log.info("Fetching patient with id: {}", id);
        return patientRepository.findById(id);
    }

    @Override
    @Transactional
    public Patient savePatient(Patient patient) {
        log.info("Saving patient: {} {}", patient.getFirstName(), patient.getLastName());
        return patientRepository.save(patient);
    }

    @Override
    @Transactional
    public Patient updatePatient(Long id, Patient patientDetails) {
        log.info("Updating patient with id: {}", id);

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        // Update fields
        patient.setFirstName(patientDetails.getFirstName());
        patient.setLastName(patientDetails.getLastName());
        patient.setDateOfBirth(patientDetails.getDateOfBirth());
        patient.setGender(patientDetails.getGender());
        patient.setContactNumber(patientDetails.getContactNumber());
        patient.setAddress(patientDetails.getAddress());
        patient.setBloodGroup(patientDetails.getBloodGroup());
        patient.setEmergencyContactName(patientDetails.getEmergencyContactName());
        patient.setEmergencyContactNumber(patientDetails.getEmergencyContactNumber());

        return patientRepository.save(patient);
    }

    @Override
    @Transactional
    public void deletePatient(Long id) {
        log.info("Deleting patient with id: {}", id);

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));

        patientRepository.delete(patient);
        log.info("✅ Patient deleted successfully");
    }
}
