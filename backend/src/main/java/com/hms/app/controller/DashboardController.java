package com.hms.app.controller;

import com.hms.app.dto.*;
import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import com.hms.app.repository.UserRepository;
import com.hms.app.service.DashboardService;
import com.hms.app.service.RoutingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class DashboardController {

    private final DashboardService dashboardService;
    private final RoutingService routingService;
    private final UserRepository userRepository;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardData>> getAdminDashboard() {
        try {
            AdminDashboardData data = dashboardService.getAdminDashboardData();
            ApiResponse<AdminDashboardData> response = new ApiResponse<>("Admin dashboard loaded successfully", data, true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error loading admin dashboard: {}", e.getMessage());
            ApiResponse<AdminDashboardData> errorResponse = new ApiResponse<>("Failed to load admin dashboard: " + e.getMessage(), null, false);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/doctor")
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<ApiResponse<DoctorDashboardData>> getDoctorDashboard(Authentication authentication) {
        try {
            DoctorDashboardData data = dashboardService.getDoctorDashboardData(authentication.getName());
            ApiResponse<DoctorDashboardData> response = new ApiResponse<>("Doctor dashboard loaded successfully", data, true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error loading doctor dashboard: {}", e.getMessage());
            ApiResponse<DoctorDashboardData> errorResponse = new ApiResponse<>("Failed to load doctor dashboard: " + e.getMessage(), null, false);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/patient")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<ApiResponse<PatientDashboardData>> getPatientDashboard(Authentication authentication) {
        try {
            PatientDashboardData data = dashboardService.getPatientDashboardData(authentication.getName());
            ApiResponse<PatientDashboardData> response = new ApiResponse<>("Patient dashboard loaded successfully", data, true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error loading patient dashboard: {}", e.getMessage());
            ApiResponse<PatientDashboardData> errorResponse = new ApiResponse<>("Failed to load patient dashboard: " + e.getMessage(), null, false);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/nurse")
    @PreAuthorize("hasRole('NURSE')")
    public ResponseEntity<ApiResponse<NurseDashboardData>> getNurseDashboard(Authentication authentication) {
        try {
            NurseDashboardData data = dashboardService.getNurseDashboardData(authentication.getName());
            ApiResponse<NurseDashboardData> response = new ApiResponse<>("Nurse dashboard loaded successfully", data, true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error loading nurse dashboard: {}", e.getMessage());
            ApiResponse<NurseDashboardData> errorResponse = new ApiResponse<>("Failed to load nurse dashboard: " + e.getMessage(), null, false);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getDashboard(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            User user = userRepository.findByUsernameOrEmailIgnoreCase(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Role userRole = user.getRole();
            Object dashboardData;
            String message;

            switch (userRole) {
                case ADMIN -> {
                    dashboardData = dashboardService.getAdminDashboardData();
                    message = "Admin dashboard loaded successfully";
                }
                case DOCTOR -> {
                    dashboardData = dashboardService.getDoctorDashboardData(userEmail);
                    message = "Doctor dashboard loaded successfully";
                }
                case PATIENT -> {
                    dashboardData = dashboardService.getPatientDashboardData(userEmail);
                    message = "Patient dashboard loaded successfully";
                }
                case NURSE -> {
                    dashboardData = dashboardService.getNurseDashboardData(userEmail);
                    message = "Nurse dashboard loaded successfully";
                }
                default -> throw new RuntimeException("Unsupported role: " + userRole);
            }

            ApiResponse<Object> response = new ApiResponse<>(message, dashboardData, true);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error loading dashboard: {}", e.getMessage());
            ApiResponse<Object> errorResponse = new ApiResponse<>("Failed to load dashboard: " + e.getMessage(), null, false);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/redirect-url")
    public ResponseEntity<ApiResponse<String>> getRedirectUrl(Authentication authentication) {
        try {
            String userEmail = authentication.getName();
            User user = userRepository.findByUsernameOrEmailIgnoreCase(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String redirectUrl = routingService.getRedirectUrlByRole(user.getRole());
            ApiResponse<String> response = new ApiResponse<>("Redirect URL retrieved successfully", redirectUrl, true);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error getting redirect URL: {}", e.getMessage());
            ApiResponse<String> errorResponse = new ApiResponse<>("Failed to get redirect URL: " + e.getMessage(), null, false);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserProfile>> getUserProfile(Authentication authentication) {
        try {
            UserProfile profile = dashboardService.getUserProfile(authentication.getName());
            ApiResponse<UserProfile> response = new ApiResponse<>("User profile retrieved successfully", profile, true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting user profile: {}", e.getMessage());
            ApiResponse<UserProfile> errorResponse = new ApiResponse<>("Failed to get user profile: " + e.getMessage(), null, false);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
