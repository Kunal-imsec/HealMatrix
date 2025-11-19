package com.hms.app.dto;

import com.hms.app.enums.AppointmentStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AppointmentResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private Long doctorId;
    private String doctorName;
    private LocalDateTime appointmentDate;
    private String reason;
    private AppointmentStatus status;
}