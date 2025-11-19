package com.hms.app.repository;

import com.hms.app.entity.Appointment;
import com.hms.app.entity.Doctor;
import com.hms.app.entity.Patient;
import com.hms.app.enums.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Find by entity (existing)
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByDoctor(Doctor doctor);

    // ✅ ADDED: Find by IDs (needed for controller)
    @Query("SELECT a FROM Appointment a WHERE a.patient.patientId = :patientId")
    List<Appointment> findByPatientId(@Param("patientId") Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.doctor.doctorId = :doctorId")
    List<Appointment> findByDoctorId(@Param("doctorId") Long doctorId);

    // Find by date range
    List<Appointment> findByAppointmentDateTimeBetween(LocalDateTime start, LocalDateTime end);

    // ✅ ADDED: Find by status
    List<Appointment> findByStatus(AppointmentStatus status);

    // ✅ ADDED: Find upcoming appointments for patient
    @Query("SELECT a FROM Appointment a WHERE a.patient.patientId = :patientId " +
            "AND a.appointmentDateTime > :now " +
            "AND a.status = 'SCHEDULED' " +
            "ORDER BY a.appointmentDateTime ASC")
    List<Appointment> findUpcomingAppointmentsByPatient(
            @Param("patientId") Long patientId,
            @Param("now") LocalDateTime now
    );

    // ✅ ADDED: Count by patient and status
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.patient.patientId = :patientId " +
            "AND a.status = :status AND a.appointmentDateTime > :afterDate")
    int countByPatientAndStatusAndAppointmentTimeAfter(
            @Param("patientId") Long patientId,
            @Param("status") AppointmentStatus status,
            @Param("afterDate") LocalDateTime afterDate
    );

    // ✅ ADDED: Find top 5 recent by patient
    @Query("SELECT a FROM Appointment a WHERE a.patient.patientId = :patientId " +
            "ORDER BY a.appointmentDateTime DESC")
    List<Appointment> findTop5ByPatientOrderByAppointmentTimeDesc(@Param("patientId") Long patientId);
}
