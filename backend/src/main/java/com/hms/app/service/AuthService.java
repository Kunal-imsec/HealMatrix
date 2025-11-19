package com.hms.app.service;

import com.hms.app.dto.*;

public interface AuthService {

    /**
     * Public registration - Creates PATIENT role ONLY
     * Staff roles (DOCTOR, NURSE, etc.) can ONLY be created by ADMIN
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Login for ALL roles (ADMIN, DOCTOR, NURSE, PATIENT, RECEPTIONIST, PHARMACIST)
     * Staff get credentials offline from admin
     */
    AuthResponse login(LoginRequest request);

    /**
     * Patient-specific registration (same as register, kept for compatibility)
     */
    void registerPatient(PatientRegistrationRequest request);

    // Password reset functionality
    void sendPasswordResetEmail(String email);
    void resetPassword(String token, String newPassword);
}
