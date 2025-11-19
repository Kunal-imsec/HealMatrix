package com.hms.app.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminDashboardData {
    private String welcomeMessage;
    private int totalUsers;
    private int totalDoctors;
    private int totalPatients;
    private int totalNurses;
    private int todayAppointments;
    private String redirectUrl;
    private List<RecentActivity> recentActivities;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentActivity {
        private String action;
        private String user;
        private String timestamp;
        private String type;
    }
}
