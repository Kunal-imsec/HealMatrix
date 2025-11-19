package com.hms.app.service.impl;

import com.hms.app.exception.ResourceNotFoundException;
import com.hms.app.entity.Doctor;
import com.hms.app.repository.DoctorRepository;
import com.hms.app.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Autowired
    public DoctorServiceImpl(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Override
    public Doctor addDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }


    @Override
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    @Override
    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));

        doctor.setFirstName(doctorDetails.getFirstName());
        doctor.setLastName(doctorDetails.getLastName());
        doctor.setSpecialization(doctorDetails.getSpecialization());

        return doctorRepository.save(doctor);
    }

    @Override
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        doctorRepository.delete(doctor);
    }
}
