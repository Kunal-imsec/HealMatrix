package com.hms.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PatientDashboardData {
    private String welcomeMessage;
    private int upcomingAppointments;
    private LocalDateTime nextAppointment;
    private String nextAppointmentDoctor;
    private String redirectUrl;
    private List<UpcomingAppointment> appointments;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UpcomingAppointment {
        private Long appointmentId;
        private String doctorName;
        private String specialization;
        private LocalDateTime appointmentTime;
        private String status;
    }
}
