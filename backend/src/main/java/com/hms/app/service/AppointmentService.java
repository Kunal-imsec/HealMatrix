package com.hms.app.service;

import com.hms.app.entity.Appointment;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {

    Appointment saveAppointment(Appointment appointment);

    List<Appointment> getAllAppointments();

    Optional<Appointment> getAppointmentById(Long id);

    void deleteAppointment(Long id);

    // ✅ ADDED: Methods needed by controller
    List<Appointment> getAppointmentsByPatientId(Long patientId);

    List<Appointment> getAppointmentsByDoctorId(Long doctorId);
}
