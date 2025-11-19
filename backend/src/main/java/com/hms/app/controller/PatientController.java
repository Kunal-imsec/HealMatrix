package com.hms.app.controller;

import com.hms.app.dto.PatientResponse;
import com.hms.app.entity.Appointment;
import com.hms.app.entity.Patient;
import com.hms.app.entity.User;
import com.hms.app.enums.AppointmentStatus;
import com.hms.app.repository.AppointmentRepository;
import com.hms.app.repository.MedicalRecordRepository;
import com.hms.app.repository.PatientRepository;
import com.hms.app.repository.UserRepository;
import com.hms.app.service.PatientService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/v1/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientService patientService;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getPatientDashboard(Authentication authentication) {
        try {
            log.info("📊 Dashboard request from: {}", authentication.getName());

            String userEmail = authentication.getName();

            // Find user
            User user = userRepository.findByEmailIgnoreCase(userEmail)
                    .orElseThrow(() -> {
                        log.error("❌ User not found: {}", userEmail);
                        return new RuntimeException("User not found");
                    });

            log.info("✅ User found: ID={}, Email={}", user.getId(), user.getEmail());

            // ✅ Check if patient record exists
            Optional<Patient> patientOptional = patientRepository.findByUser_Id(user.getId());

            if (patientOptional.isEmpty()) {
                log.error("❌ PATIENT RECORD NOT FOUND for User ID: {}", user.getId());

                // Return 404 with helpful error message
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("status", "error");
                errorResponse.put("code", "PATIENT_RECORD_NOT_FOUND");
                errorResponse.put("message", "Your patient profile hasn't been created yet. Please contact the receptionist or administrator to complete your registration.");
                errorResponse.put("userId", user.getId());
                errorResponse.put("email", user.getEmail());
                errorResponse.put("action", "Please contact support to complete your patient profile setup.");

                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }

            Patient patient = patientOptional.get();
            log.info("✅ Patient found: ID={}, Name={} {}",
                    patient.getPatientId(), patient.getFirstName(), patient.getLastName());

            // Build dashboard data
            Map<String, Object> dashboard = new HashMap<>();
            dashboard.put("status", "success");
            dashboard.put("welcomeMessage", "Welcome back, " + patient.getFirstName() + "!");

            // Get counts
            int upcomingAppointments = appointmentRepository.countByPatientAndStatusAndAppointmentTimeAfter(
                    patient.getPatientId(),
                    AppointmentStatus.SCHEDULED,
                    LocalDateTime.now()
            );
            dashboard.put("upcomingAppointments", upcomingAppointments);

            int medicalRecordsCount = medicalRecordRepository.countByPatient(patient);
            dashboard.put("medicalRecordsCount", medicalRecordsCount);

            dashboard.put("activePrescriptions", 0);
            dashboard.put("outstandingBills", 0.0);

            // Get appointments
            List<Appointment> recentAppointments = appointmentRepository
                    .findTop5ByPatientOrderByAppointmentTimeDesc(patient.getPatientId());

            List<Map<String, Object>> appointmentsList = recentAppointments.stream()
                    .map(apt -> {
                        Map<String, Object> aptMap = new HashMap<>();
                        aptMap.put("appointmentId", apt.getAppointmentId());
                        aptMap.put("doctorName", "Dr. " + apt.getDoctor().getFirstName() + " " + apt.getDoctor().getLastName());
                        aptMap.put("specialization", apt.getDoctor().getSpecialization());
                        aptMap.put("appointmentDateTime", apt.getAppointmentDateTime());
                        aptMap.put("status", apt.getStatus().toString());
                        aptMap.put("reason", apt.getReason());

                        Map<String, Object> doctorMap = new HashMap<>();
                        doctorMap.put("doctorId", apt.getDoctor().getDoctorId());
                        doctorMap.put("firstName", apt.getDoctor().getFirstName());
                        doctorMap.put("lastName", apt.getDoctor().getLastName());
                        doctorMap.put("specialization", apt.getDoctor().getSpecialization());
                        aptMap.put("doctor", doctorMap);

                        return aptMap;
                    })
                    .collect(Collectors.toList());

            dashboard.put("appointments", appointmentsList);

            // Patient info
            Map<String, Object> patientInfo = new HashMap<>();
            patientInfo.put("patientId", patient.getPatientId());
            patientInfo.put("firstName", patient.getFirstName());
            patientInfo.put("lastName", patient.getLastName());
            patientInfo.put("email", user.getEmail());
            patientInfo.put("dateOfBirth", patient.getDateOfBirth());
            patientInfo.put("gender", patient.getGender());
            patientInfo.put("contactNumber", patient.getContactNumber());
            patientInfo.put("bloodGroup", patient.getBloodGroup());
            dashboard.put("patientInfo", patientInfo);

            log.info("✅ Dashboard compiled successfully");
            return ResponseEntity.ok(dashboard);

        } catch (Exception e) {
            log.error("❌ Dashboard error: {}", e.getMessage(), e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("code", "DASHBOARD_ERROR");
            errorResponse.put("message", "Failed to load dashboard: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            User user = userRepository.findByEmailIgnoreCase(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Patient patient = patientRepository.findByUser_Id(user.getId())
                    .orElseThrow(() -> new RuntimeException("Patient record not found"));

            return ResponseEntity.ok(convertToResponse(patient));

        } catch (Exception e) {
            log.error("Error fetching profile: {}", e.getMessage());

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", "error");
            errorResponse.put("message", e.getMessage());

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST')")
    public ResponseEntity<List<PatientResponse>> getAllPatients() {
        List<Patient> patients = patientService.getAllPatients();
        List<PatientResponse> response = patients.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT')")
    public ResponseEntity<PatientResponse> getPatientById(@PathVariable Long id) {
        Patient patient = patientService.getPatientById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        return ResponseEntity.ok(convertToResponse(patient));
    }

    private PatientResponse convertToResponse(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setId(patient.getPatientId());
        response.setPatientId("P-" + String.format("%06d", patient.getPatientId()));
        response.setFirstName(patient.getFirstName());
        response.setLastName(patient.getLastName());
        response.setFullName(patient.getFirstName() + " " + patient.getLastName());
        response.setDateOfBirth(patient.getDateOfBirth());
        response.setGender(patient.getGender());
        response.setPhoneNumber(patient.getContactNumber());
        response.setAddress(patient.getAddress());
        response.setBloodGroup(patient.getBloodGroup());

        if (patient.getUser() != null) {
            response.setEmail(patient.getUser().getEmail());
            response.setUserId(patient.getUser().getId());
        }

        if (patient.getDateOfBirth() != null) {
            response.setAge(java.time.Period.between(
                    patient.getDateOfBirth(),
                    java.time.LocalDate.now()
            ).getYears());
        }

        response.setStatus("ACTIVE");
        return response;
    }
}
