package com.hms.app.service;

import com.hms.app.dto.*;
import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import java.util.List;

public interface AdminService {

    // =========================
    // ADMIN MANAGEMENT
    // =========================
    AdminDashboardData getDashboardData();

    // =========================
    // USER MANAGEMENT
    // =========================
    List<User> getAllUsers();
    User getUserById(Long id);
    void deleteUser(Long id);
    void activateUser(Long id);
    void deactivateUser(Long id);

    // =========================
    // DOCTOR MANAGEMENT
    // =========================
    DoctorResponse createDoctor(DoctorRequest request);
    List<DoctorResponse> getAllDoctors();
    DoctorResponse getDoctorById(Long id);
    DoctorResponse updateDoctor(Long id, DoctorRequest request);
    void deleteDoctor(Long id);

    // =========================
    // STAFF MANAGEMENT
    // =========================
    UserResponse createStaff(UserRequest request);
    List<UserResponse> getStaffByRole(Role role);
    List<User> getAllStaff();
    void resetStaffPassword(Long userId, String newPassword);

    // Optional role-specific staff creation
    UserResponse createNurse(UserRequest request);
    List<UserResponse> getAllNurses();

    UserResponse createReceptionist(UserRequest request);
    List<UserResponse> getAllReceptionists();

    UserResponse createPharmacist(UserRequest request);
    List<UserResponse> getAllPharmacists();
}
