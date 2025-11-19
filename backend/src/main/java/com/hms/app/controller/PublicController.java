package com.hms.app.controller;

import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import com.hms.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/public")
@RequiredArgsConstructor
public class PublicController {

    private final UserRepository userRepository;

    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "Hospital Management System is running!");
        response.put("timestamp", java.time.LocalDateTime.now());
        return ResponseEntity.ok(response);
    }

    // Database statistics (Development only)
    @GetMapping("/db-stats")
    public ResponseEntity<Map<String, Object>> getDatabaseStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("adminCount", userRepository.countByRole(Role.ADMIN));
        stats.put("doctorCount", userRepository.countByRole(Role.DOCTOR));
        stats.put("nurseCount", userRepository.countByRole(Role.NURSE));
        stats.put("patientCount", userRepository.countByRole(Role.PATIENT));
        stats.put("adminExists", userRepository.existsByEmail("admin@hospital.com"));
        stats.put("systemReady", userRepository.existsByEmail("admin@hospital.com"));

        return ResponseEntity.ok(stats);
    }

    // List all users (Basic info only - for development)
    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();

        List<Map<String, Object>> userList = users.stream().map(user -> {
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("email", user.getEmail());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("role", user.getRole());
            userInfo.put("enabled", user.isEnabled());
            // Don't include password or sensitive data
            return userInfo;
        }).toList();

        return ResponseEntity.ok(userList);
    }

    // Check if admin exists
    @GetMapping("/admin-status")
    public ResponseEntity<Map<String, Object>> getAdminStatus() {
        Map<String, Object> status = new HashMap<>();
        boolean adminExists = userRepository.existsByEmail("admin@hospital.com");

        status.put("adminExists", adminExists);
        status.put("adminEmail", adminExists ? "admin@hospital.com" : "Not created");
        status.put("message", adminExists ? "Admin user is ready" : "Admin user not found");
        status.put("credentials", adminExists ? "admin@hospital.com / Admin123!" : "N/A");

        return ResponseEntity.ok(status);
    }
}
