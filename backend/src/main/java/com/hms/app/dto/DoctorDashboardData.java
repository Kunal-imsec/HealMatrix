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
public class DoctorDashboardData {
    private String welcomeMessage;
    private int todayAppointments;
    private int upcomingAppointments;
    private int totalPatients;
    private String redirectUrl;
    private List<TodayAppointment> todaysSchedule;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TodayAppointment {
        private Long appointmentId;
        private String patientName;
        private LocalDateTime appointmentTime;
        private String reason;
        private String status;
    }
}
