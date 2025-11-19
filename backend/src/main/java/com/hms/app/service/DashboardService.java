package com.hms.app.service;

import com.hms.app.dto.*;

public interface DashboardService {
    AdminDashboardData getAdminDashboardData();
    DoctorDashboardData getDoctorDashboardData(String doctorEmail);
    PatientDashboardData getPatientDashboardData(String patientEmail);
    NurseDashboardData getNurseDashboardData(String nurseEmail);
    UserProfile getUserProfile(String email);
}
