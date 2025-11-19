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
public class NurseDashboardData {
    private String welcomeMessage;
    private int assignedPatients;
    private int tasksToday;
    private int urgentTasks;
    private String redirectUrl;
    private List<PatientTask> tasks;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class PatientTask {
        private Long taskId;
        private String patientName;
        private String taskType;
        private String priority;
        private String status;
    }
}
