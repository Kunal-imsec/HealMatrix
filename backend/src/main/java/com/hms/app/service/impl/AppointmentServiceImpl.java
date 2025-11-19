package com.hms.app.service.impl;

import com.hms.app.entity.Appointment;
import com.hms.app.repository.AppointmentRepository;
import com.hms.app.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor  // ✅ Better than @Autowired
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public Appointment saveAppointment(Appointment appointment) {
        log.info("Saving appointment");
        return appointmentRepository.save(appointment);
    }

    @Override
    public List<Appointment> getAllAppointments() {
        log.info("Fetching all appointments");
        return appointmentRepository.findAll();
    }

    @Override
    public Optional<Appointment> getAppointmentById(Long id) {
        log.info("Fetching appointment by id: {}", id);
        return appointmentRepository.findById(id);
    }

    @Override
    @Transactional
    public void deleteAppointment(Long id) {
        log.info("Deleting appointment: {}", id);
        appointmentRepository.deleteById(id);
    }

    // ✅ IMPLEMENTED: Get appointments by patient ID
    @Override
    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        log.info("Fetching appointments for patient: {}", patientId);
        return appointmentRepository.findByPatientId(patientId);
    }

    // ✅ IMPLEMENTED: Get appointments by doctor ID
    @Override
    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        log.info("Fetching appointments for doctor: {}", doctorId);
        return appointmentRepository.findByDoctorId(doctorId);
    }
}
