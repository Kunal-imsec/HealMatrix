package com.hms.app.service;

import com.hms.app.entity.Doctor;
import java.util.List;
import java.util.Optional;

public interface DoctorService {
    Doctor addDoctor(Doctor doctor);
    List<Doctor> getAllDoctors();
    Optional<Doctor> getDoctorById(Long id);
    Doctor updateDoctor(Long id, Doctor doctorDetails); // Changed return type
    void deleteDoctor(Long id); // Changed return type
}
