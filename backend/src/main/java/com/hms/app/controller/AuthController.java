package com.hms.app.controller;

import com.hms.app.dto.*;
import com.hms.app.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping({"/api/v1/auth", "/api/auth"})
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * Public registration - always creates PATIENT role
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Force role to PATIENT for public registration
            request.setRole("PATIENT");
            AuthResponse response = authService.register(request);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Registration failed: {}", e.getMessage(), e);
            AuthResponse errorResponse = AuthResponse.builder()
                    .message("Registration failed: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Login for all users (Patient, Doctor, Nurse, Admin, etc.)
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage(), e);
            AuthResponse errorResponse = AuthResponse.builder()
                    .message("Login failed: " + e.getMessage())
                    .build();
            return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
    }

    /**
     * Password reset request
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody String email) {
        try {
            authService.sendPasswordResetEmail(email);
            ApiResponse<String> response = new ApiResponse<>("Password reset link sent to your email", null, true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Forgot password failed: {}", e.getMessage(), e);
            ApiResponse<String> errorResponse = new ApiResponse<>("Failed to send reset link: " + e.getMessage(), null, false);
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Favicon handler to prevent 404 errors in logs
     */
    @GetMapping("/favicon.ico")
    @ResponseBody
    public void favicon() {
        // Return nothing to prevent 404
    }

    /**
     * Reset password using token
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @RequestParam String token,
            @RequestBody String newPassword
    ) {
        try {
            authService.resetPassword(token, newPassword);
            ApiResponse<String> response = new ApiResponse<>("Password reset successfully", null, true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Reset password failed: {}", e.getMessage(), e);
            ApiResponse<String> errorResponse = new ApiResponse<>("Failed to reset password: " + e.getMessage(), null, false);
            return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }
    }
}
