package com.hms.app.entity;

import com.hms.app.enums.AppointmentStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data  // ✅ Generates getters, setters, toString, equals, hashCode
@NoArgsConstructor  // ✅ Default constructor
@AllArgsConstructor  // ✅ All-args constructor
@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Long appointmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    @Column(name = "appointment_date_time", nullable = false)
    private LocalDateTime appointmentDateTime;

    @Column(name = "reason")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppointmentStatus status = AppointmentStatus.SCHEDULED;  // ✅ Default value

    @Column(columnDefinition = "TEXT")
    private String notes;

    // You can keep the manual getters/setters if you prefer,
    // but @Data already generates them
}
