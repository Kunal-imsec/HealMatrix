package com.hms.app.service.impl;

import com.hms.app.dto.*;
import com.hms.app.entity.Doctor;
import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import com.hms.app.exception.DuplicateResourceException;
import com.hms.app.exception.ResourceNotFoundException;
import com.hms.app.repository.*;
import com.hms.app.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PasswordEncoder passwordEncoder;

    // ==================== USER MANAGEMENT ====================

    @Override
    public List<User> getAllUsers() {
        log.info("Fetching all users from database");
        try {
            List<User> users = userRepository.findAll();
            log.info("Found {} users in database", users.size());
            return users;
        } catch (Exception e) {
            log.error("Error fetching users: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch users: " + e.getMessage());
        }
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = getUserById(id);
        user.setEnabled(false);
        userRepository.save(user);
        log.info("User deleted/deactivated: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void activateUser(Long id) {
        User user = getUserById(id);
        user.activate();
        userRepository.save(user);
        log.info("User activated: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void deactivateUser(Long id) {
        User user = getUserById(id);
        user.deactivate();
        userRepository.save(user);
        log.info("User deactivated: {}", user.getEmail());
    }

    // ==================== DASHBOARD ====================

    @Override
    public AdminDashboardData getDashboardData() {
        try {
            int totalUsers = (int) userRepository.count();
            int totalDoctors = (int) doctorRepository.count();
            int totalPatients = (int) patientRepository.count();
            int totalNurses = (int) userRepository.countByRole(Role.NURSE);
            int todayAppointments = 0; // Placeholder

            return AdminDashboardData.builder()
                    .welcomeMessage("Welcome to Admin Dashboard")
                    .totalUsers(totalUsers)
                    .totalDoctors(totalDoctors)
                    .totalPatients(totalPatients)
                    .totalNurses(totalNurses)
                    .todayAppointments(todayAppointments)
                    .redirectUrl("/admin/dashboard")
                    .build();
        } catch (Exception e) {
            log.error("Error fetching dashboard data: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch dashboard data: " + e.getMessage());
        }
    }

    // ==================== DOCTOR MANAGEMENT ====================

    @Override
    @Transactional
    public DoctorResponse createDoctor(DoctorRequest request) {
        log.info("Creating doctor: {}", request.getEmail());

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        try {
            // ✅ FIXED: Added username field
            User user = User.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail().toLowerCase().trim())
                    .username(request.getEmail().toLowerCase().trim())  // ✅ CRITICAL FIX
                    .password(passwordEncoder.encode("Doctor@123"))
                    .role(Role.DOCTOR)
                    .isActive(true)  // ✅ Added
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .build();

            User savedUser = userRepository.save(user);

            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setFirstName(request.getFirstName());
            doctor.setLastName(request.getLastName());
            doctor.setSpecialization(request.getSpecialization());
            doctor.setAvailable(true);  // ✅ Set default availability

            Doctor savedDoctor = doctorRepository.save(doctor);
            log.info("✅ Doctor created successfully: {}", savedDoctor.getUser().getEmail());

            return mapToDoctorResponse(savedDoctor);

        } catch (Exception e) {
            log.error("❌ Failed to create doctor: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create doctor: " + e.getMessage());
        }
    }

    @Override
    public List<DoctorResponse> getAllDoctors() {
        log.info("📋 Fetching all doctors from database");
        try {
            List<Doctor> doctors = doctorRepository.findAll();
            log.info("✅ Found {} doctors in database", doctors.size());

            return doctors.stream()
                    .map(this::mapToDoctorResponse)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("❌ Error fetching doctors: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch doctors: " + e.getMessage());
        }
    }

    private DoctorResponse mapToDoctorResponse(Doctor doctor) {
        DoctorResponse response = new DoctorResponse();

        // Basic IDs
        response.setId(doctor.getDoctorId());
        response.setDoctorId(doctor.getDoctorId());

        // Personal info
        response.setFirstName(doctor.getFirstName());
        response.setLastName(doctor.getLastName());
        response.setFullName("Dr. " + doctor.getFirstName() + " " + doctor.getLastName());

        // Contact & credentials
        response.setEmail(doctor.getUser() != null ? doctor.getUser().getEmail() : null);
        response.setContactNumber(doctor.getContactNumber());
        response.setQualification(doctor.getQualification());
        response.setLicenseNumber(doctor.getLicenseNumber());

        // Professional details
        response.setSpecialization(doctor.getSpecialization());
        response.setExperience(doctor.getExperience());

        // Department
        if (doctor.getDepartment() != null) {
            response.setDepartmentId(doctor.getDepartment().getDepartmentId());
            response.setDepartmentName(doctor.getDepartment().getName());
            response.setDepartment(doctor.getDepartment());
        }

        // Availability & Status
        response.setAvailable(doctor.getAvailable() != null ? doctor.getAvailable() : false);
        response.setAvailableToday(doctor.getAvailable() != null ? doctor.getAvailable() : false);
        response.setStatus(doctor.getAvailable() != null && doctor.getAvailable() ? "ACTIVE" : "INACTIVE");

        // Rating (default)
        response.setRating(4.5);

        // Appointment count
        if (doctor.getAppointments() != null) {
            response.setAppointmentCount(doctor.getAppointments().size());
        }

        return response;
    }

    @Override
    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
        return mapToDoctorResponse(doctor);
    }

    @Override
    @Transactional
    public DoctorResponse updateDoctor(Long id, DoctorRequest request) {
        log.info("Updating doctor with id: {}", id);

        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        User user = doctor.getUser();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setUsername(request.getEmail());  // ✅ Update username too
        userRepository.save(user);

        doctor.setFirstName(request.getFirstName());
        doctor.setLastName(request.getLastName());
        doctor.setSpecialization(request.getSpecialization());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        log.info("✅ Doctor updated successfully: {}", updatedDoctor.getUser().getEmail());

        return mapToDoctorResponse(updatedDoctor);
    }

    @Override
    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        User user = doctor.getUser();
        user.deactivate();
        userRepository.save(user);

        log.info("✅ Doctor deleted/deactivated: {}", user.getEmail());
    }

    // ==================== STAFF MANAGEMENT ====================

    @Override
    @Transactional
    public UserResponse createStaff(UserRequest request) {
        log.info("Creating staff member: {} with role: {}", request.getEmail(), request.getRole());

        if (request.getRole() == Role.PATIENT || request.getRole() == Role.ADMIN) {
            throw new RuntimeException("Cannot create PATIENT or ADMIN through this endpoint");
        }

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        // ✅ FIXED: Added username field
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .username(request.getEmail().toLowerCase().trim())  // ✅ CRITICAL FIX
                .password(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "Staff@123"))
                .role(request.getRole())
                .isActive(true)  // ✅ Added
                .enabled(true)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .credentialsNonExpired(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("✅ Staff member created: {} with role: {}", savedUser.getEmail(), savedUser.getRole());

        return mapToUserResponse(savedUser);
    }

    @Override
    public List<UserResponse> getStaffByRole(Role role) {
        return userRepository.findByRole(role).stream()
                .filter(User::isActive)
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> getAllStaff() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() != Role.PATIENT)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void resetStaffPassword(Long userId, String newPassword) {
        User user = getUserById(userId);

        if (!isValidPassword(newPassword)) {
            throw new RuntimeException("Password must be at least 8 characters with uppercase, lowercase, and number");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password reset for user: {}", user.getEmail());
    }

    // ==================== ROLE-SPECIFIC STAFF CREATION ====================

    @Override
    public UserResponse createNurse(UserRequest request) {
        request.setRole(Role.NURSE);
        return createStaff(request);
    }

    @Override
    public UserResponse createReceptionist(UserRequest request) {
        request.setRole(Role.RECEPTIONIST);
        return createStaff(request);
    }

    @Override
    public UserResponse createPharmacist(UserRequest request) {
        request.setRole(Role.PHARMACIST);
        return createStaff(request);
    }

    @Override
    public List<UserResponse> getAllNurses() {
        return getStaffByRole(Role.NURSE);
    }

    @Override
    public List<UserResponse> getAllReceptionists() {
        return getStaffByRole(Role.RECEPTIONIST);
    }

    @Override
    public List<UserResponse> getAllPharmacists() {
        return getStaffByRole(Role.PHARMACIST);
    }

    // ==================== HELPER METHODS ====================

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getUsername(),
                user.getEmail(),
                user.getRole(),
                user.isActive(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getLastLoginAt()
        );
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    private boolean isValidPassword(String password) {
        return password != null &&
                password.length() >= 8 &&
                password.matches(".*[A-Z].*") &&
                password.matches(".*[a-z].*") &&
                password.matches(".*\\d.*");
    }
}
