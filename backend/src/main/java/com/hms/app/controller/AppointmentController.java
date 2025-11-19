package com.hms.app.controller;

import com.hms.app.entity.Appointment;
import com.hms.app.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/v1/appointments")  // ✅ FIXED: Added /v1
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<Appointment> createAppointment(@RequestBody Appointment appointment) {
        log.info("Creating new appointment");
        Appointment savedAppointment = appointmentService.saveAppointment(appointment);
        return new ResponseEntity<>(savedAppointment, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        log.info("Fetching all appointments");
        List<Appointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        log.info("Fetching appointment by id: {}", id);
        Optional<Appointment> appointmentOptional = appointmentService.getAppointmentById(id);
        return appointmentOptional.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ NEW: Get patient's appointments
    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Long patientId) {
        log.info("Fetching appointments for patient: {}", patientId);
        List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }

    // ✅ NEW: Get doctor's appointments
    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Long doctorId) {
        log.info("Fetching appointments for doctor: {}", doctorId);
        List<Appointment> appointments = appointmentService.getAppointmentsByDoctorId(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointmentDetails) {
        log.info("Updating appointment: {}", id);
        Optional<Appointment> appointmentOptional = appointmentService.getAppointmentById(id);

        if (!appointmentOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Appointment existingAppointment = appointmentOptional.get();
        existingAppointment.setPatient(appointmentDetails.getPatient());
        existingAppointment.setDoctor(appointmentDetails.getDoctor());
        existingAppointment.setAppointmentDateTime(appointmentDetails.getAppointmentDateTime());
        existingAppointment.setStatus(appointmentDetails.getStatus());

        Appointment updatedAppointment = appointmentService.saveAppointment(existingAppointment);
        return ResponseEntity.ok(updatedAppointment);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id) {
        log.info("Deleting appointment: {}", id);
        if (!appointmentService.getAppointmentById(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }
}
