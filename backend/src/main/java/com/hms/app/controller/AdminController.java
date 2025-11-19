package com.hms.app.controller;

import com.hms.app.dto.*;
import com.hms.app.entity.Department;
import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import com.hms.app.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    // ==================== USERS ====================

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            List<User> users = adminService.getAllUsers();
            return ResponseEntity.ok(new ApiResponse<>("Users retrieved successfully", users, true));
        } catch (Exception e) {
            log.error("Failed to retrieve users: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to retrieve users: " + e.getMessage(), null, false));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        try {
            adminService.deleteUser(id);
            return ResponseEntity.ok(new ApiResponse<>("User deleted successfully", null, true));
        } catch (Exception e) {
            log.error("User deletion failed: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Failed to delete user: " + e.getMessage(), null, false));
        }
    }

    // ==================== DASHBOARD ====================

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardData>> getDashboard() {
        try {
            AdminDashboardData data = adminService.getDashboardData();
            return ResponseEntity.ok(new ApiResponse<>("Dashboard data retrieved successfully", data, true));
        } catch (Exception e) {
            log.error("Failed to retrieve dashboard data: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to retrieve dashboard: " + e.getMessage(), null, false));
        }
    }

    // ==================== DOCTOR MANAGEMENT ====================

    // ✅ IMPORTANT: Specific routes BEFORE path variables!
    @GetMapping("/doctors/specializations")
    public ResponseEntity<ApiResponse<List<String>>> getSpecializations() {
        try {
            log.info("📋 Fetching specializations");
            List<String> specializations = Arrays.asList(
                    "Cardiology",
                    "Neurology",
                    "Pediatrics",
                    "Orthopedics",
                    "Dermatology",
                    "Gynecology",
                    "Psychiatry",
                    "General Medicine",
                    "Surgery",
                    "Radiology"
            );
            return ResponseEntity.ok(new ApiResponse<>("Specializations retrieved successfully", specializations, true));
        } catch (Exception e) {
            log.error("Failed to get specializations: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to get specializations", null, false));
        }
    }

    @GetMapping("/doctors")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getAllDoctors() {
        try {
            log.info("📋 AdminController: Getting all doctors");
            List<DoctorResponse> doctors = adminService.getAllDoctors();
            log.info("✅ AdminController: Returning {} doctors", doctors.size());
            return ResponseEntity.ok(new ApiResponse<>("Doctors retrieved successfully", doctors, true));
        } catch (Exception e) {
            log.error("❌ Failed to retrieve doctors: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to retrieve doctors: " + e.getMessage(), null, false));
        }
    }

    // ✅ Path variable routes LAST
    @GetMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorById(@PathVariable Long id) {
        try {
            log.info("🔍 Getting doctor by ID: {}", id);
            DoctorResponse doctor = adminService.getDoctorById(id);
            return ResponseEntity.ok(new ApiResponse<>("Doctor retrieved successfully", doctor, true));
        } catch (Exception e) {
            log.error("Doctor not found: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>("Doctor not found: " + e.getMessage(), null, false));
        }
    }

    @PostMapping("/doctors")
    public ResponseEntity<ApiResponse<DoctorResponse>> createDoctor(@Valid @RequestBody DoctorRequest request) {
        try {
            log.info("➕ Creating doctor: {}", request.getEmail());
            DoctorResponse doctor = adminService.createDoctor(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Doctor created successfully", doctor, true));
        } catch (Exception e) {
            log.error("Failed to create doctor: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Failed to create doctor: " + e.getMessage(), null, false));
        }
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequest request) {
        try {
            log.info("📝 Updating doctor ID: {}", id);
            DoctorResponse doctor = adminService.updateDoctor(id, request);
            return ResponseEntity.ok(new ApiResponse<>("Doctor updated successfully", doctor, true));
        } catch (Exception e) {
            log.error("Failed to update doctor: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Failed to update doctor: " + e.getMessage(), null, false));
        }
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<ApiResponse<String>> deleteDoctor(@PathVariable Long id) {
        try {
            log.info("🗑️ Deleting doctor ID: {}", id);
            adminService.deleteDoctor(id);
            return ResponseEntity.ok(new ApiResponse<>("Doctor deleted successfully", null, true));
        } catch (Exception e) {
            log.error("Failed to delete doctor: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Failed to delete doctor: " + e.getMessage(), null, false));
        }
    }

    // ==================== DEPARTMENTS ====================

    @GetMapping("/departments")
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartments() {
        try {
            log.info("📂 Fetching departments");
            // Mock data for now - replace with service call when ready
            List<DepartmentResponse> departments = Arrays.asList(
                    new DepartmentResponse(1L, "Cardiology", "Heart and cardiovascular care"),
                    new DepartmentResponse(2L, "Neurology", "Brain and nervous system"),
                    new DepartmentResponse(3L, "Pediatrics", "Child healthcare"),
                    new DepartmentResponse(4L, "Orthopedics", "Bone and joint care"),
                    new DepartmentResponse(5L, "Emergency", "Emergency medical services"),
                    new DepartmentResponse(6L, "Dermatology", "Skin care"),
                    new DepartmentResponse(7L, "Gynecology", "Women's health")
            );
            return ResponseEntity.ok(new ApiResponse<>("Departments retrieved successfully", departments, true));
        } catch (Exception e) {
            log.error("Failed to get departments: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Failed to get departments", null, false));
        }
    }

    // ==================== STAFF MANAGEMENT ====================

    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<UserResponse>> createStaff(@Valid @RequestBody UserRequest request) {
        try {
            log.info("➕ Creating staff: {} with role: {}", request.getEmail(), request.getRole());
            UserResponse staff = adminService.createStaff(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Staff created successfully", staff, true));
        } catch (Exception e) {
            log.error("Failed to create staff: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Failed to create staff: " + e.getMessage(), null, false));
        }
    }

    @GetMapping("/staff/{role}")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getStaffByRole(@PathVariable String role) {
        try {
            Role enumRole = Role.valueOf(role.toUpperCase());
            List<UserResponse> staff = adminService.getStaffByRole(enumRole);
            return ResponseEntity.ok(new ApiResponse<>("Staff retrieved successfully", staff, true));
        } catch (Exception e) {
            log.error("Failed to retrieve staff: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Failed to retrieve staff: " + e.getMessage(), null, false));
        }
    }

    @PostMapping("/staff/{id}/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @PathVariable Long id,
            @RequestBody String password) {
        try {
            adminService.resetStaffPassword(id, password);
            return ResponseEntity.ok(new ApiResponse<>("Password reset successfully", null, true));
        } catch (Exception e) {
            log.error("Failed to reset password: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>("Failed to reset password: " + e.getMessage(), null, false));
        }
    }

    // ==================== TEST ====================

    @GetMapping("/test")
    public ResponseEntity<ApiResponse<String>> adminTest() {
        return ResponseEntity.ok(
                new ApiResponse<>("Admin authentication successful!", "You have ADMIN role access", true)
        );
    }
}
