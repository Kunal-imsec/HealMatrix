package com.hms.app.service.impl;

import com.hms.app.dto.*;
import com.hms.app.entity.Patient;
import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import com.hms.app.exception.DuplicateResourceException;
import com.hms.app.repository.PatientRepository;
import com.hms.app.repository.UserRepository;
import com.hms.app.service.AuthService;
import com.hms.app.service.EmailService;
import com.hms.app.security.JwtService;
import com.hms.app.service.RoutingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;  // ✅ ADDED
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RoutingService routingService;
    private final EmailService emailService;

    // -------------------- Registration --------------------
    @Override
    @Transactional  // ✅ ADDED: Ensure both User and Patient are saved together
    public AuthResponse register(RegisterRequest request) {
        log.info("🔵 Registration attempt for: {}", request.getEmail());

        try {
            validateRegistrationRequest(request);

            // Check if user exists
            if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
                throw new DuplicateResourceException("Email already exists");
            }

            if (StringUtils.hasText(request.getUsername()) &&
                    userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
                throw new DuplicateResourceException("Username already exists");
            }

            // Security: Public registration ALWAYS creates PATIENT role
            Role userRole = Role.PATIENT;

            // Block staff self-registration
            if (StringUtils.hasText(request.getRole())) {
                String requestedRole = request.getRole().toUpperCase();
                if (!requestedRole.equals("PATIENT")) {
                    log.warn("⚠️ Attempted self-registration as {}. Blocking. Email: {}",
                            requestedRole, request.getEmail());
                    throw new RuntimeException("Self-registration is only allowed for patients. " +
                            "Staff accounts must be created by administrators.");
                }
            }

            // ✅ STEP 1: Create User
            User user = User.builder()
                    .firstName(request.getFirstName().trim())
                    .lastName(request.getLastName().trim())
                    .email(request.getEmail().toLowerCase().trim())
                    .username(StringUtils.hasText(request.getUsername()) ?
                            request.getUsername().trim() : null)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(userRole)
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .build();

            User savedUser = userRepository.save(user);
            log.info("✅ User created: ID={}, Email={}", savedUser.getId(), savedUser.getEmail());

            // ✅ STEP 2: Create Patient Record
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setFirstName(savedUser.getFirstName());
            patient.setLastName(savedUser.getLastName());
            patient.setContactNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : "N/A");
            // Set other fields if provided in request
            if (request.getDateOfBirth() != null) {
                patient.setDateOfBirth(request.getDateOfBirth());
            }
            if (request.getGender() != null) {
                patient.setGender(request.getGender());
            }
            if (request.getAddress() != null) {
                patient.setAddress(request.getAddress());
            }

            Patient savedPatient = patientRepository.save(patient);
            log.info("✅ Patient record created: PatientID={} for UserID={}",
                    savedPatient.getPatientId(), savedUser.getId());

            // Generate token
            String token = jwtService.generateToken(savedUser);

            // Build UserProfile
            UserProfile userProfile = UserProfile.builder()
                    .id(savedUser.getId())
                    .firstName(savedUser.getFirstName())
                    .lastName(savedUser.getLastName())
                    .email(savedUser.getEmail())
                    .username(savedUser.getUsername())
                    .role(savedUser.getRole().name())
                    .enabled(savedUser.isEnabled())
                    .createdAt(savedUser.getCreatedAt())
                    .lastLoginAt(savedUser.getLastLoginAt())
                    .build();

            log.info("🟢 Registration successful: User={}, Patient={}",
                    savedUser.getId(), savedPatient.getPatientId());

            return AuthResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .user(userProfile)
                    .message("Patient account created successfully")
                    .userId(savedUser.getId())
                    .username(savedUser.getUsername())
                    .email(savedUser.getEmail())
                    .role(savedUser.getRole().name())
                    .redirectUrl(routingService.getRedirectUrlByRole(savedUser.getRole()))
                    .build();

        } catch (Exception e) {
            log.error("❌ Registration failed for: {} - {}", request.getEmail(), e.getMessage(), e);
            throw new RuntimeException("Registration failed: " + e.getMessage());
        }
    }

    // -------------------- Login --------------------
    @Override
    public AuthResponse login(LoginRequest request) {
        String identifier = request.getIdentifier();
        log.info("🔵 Login attempt for: {}", identifier);

        try {
            validateLoginRequest(request);

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(identifier.trim(), request.getPassword())
            );

            User user = userRepository.findByUsernameOrEmailIgnoreCase(identifier.trim())
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            if (!user.isEnabled()) {
                throw new RuntimeException("Account is disabled. Please contact administrator.");
            }

            String token = jwtService.generateToken(user);
            updateLastLoginSafely(user);

            log.info("🟢 Login successful: User={}, Role={}", user.getEmail(), user.getRole());

            UserProfile userProfile = UserProfile.builder()
                    .id(user.getId())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .email(user.getEmail())
                    .username(user.getUsername())
                    .role(user.getRole().name())
                    .enabled(user.isEnabled())
                    .createdAt(user.getCreatedAt())
                    .lastLoginAt(user.getLastLoginAt())
                    .build();

            return AuthResponse.builder()
                    .token(token)
                    .tokenType("Bearer")
                    .user(userProfile)
                    .message("Login successful")
                    .userId(user.getId())
                    .username(user.getUsername())
                    .email(user.getEmail())
                    .role(user.getRole().name())
                    .redirectUrl(routingService.getRedirectUrlByRole(user.getRole()))
                    .build();

        } catch (BadCredentialsException e) {
            log.error("❌ Invalid credentials for: {}", identifier);
            throw new RuntimeException("Invalid username/email or password");
        } catch (AuthenticationException e) {
            log.error("❌ Authentication failed for: {} - {}", identifier, e.getMessage());
            throw new RuntimeException("Authentication failed");
        } catch (Exception e) {
            log.error("❌ Login error for: {} - {}", identifier, e.getMessage(), e);
            throw new RuntimeException("Login failed: " + e.getMessage());
        }
    }

    // -------------------- Patient Registration --------------------
    @Override
    @Transactional  // ✅ ADDED
    public void registerPatient(PatientRegistrationRequest request) {
        log.info("🔵 Patient registration attempt for: {}", request.getEmail());

        try {
            if (request == null) throw new RuntimeException("Registration request cannot be null");
            validatePatientRegistrationRequest(request);

            if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
                throw new DuplicateResourceException("Email already exists");
            }
            if (StringUtils.hasText(request.getUsername()) &&
                    userRepository.existsByUsernameIgnoreCase(request.getUsername())) {
                throw new DuplicateResourceException("Username already exists");
            }

            // ✅ Create User
            User user = User.builder()
                    .firstName(request.getFirstName().trim())
                    .lastName(request.getLastName().trim())
                    .email(request.getEmail().toLowerCase().trim())
                    .username(StringUtils.hasText(request.getUsername()) ? request.getUsername().trim() : null)
                    .password(passwordEncoder.encode(request.getPassword()))
                    .role(Role.PATIENT)
                    .enabled(true)
                    .accountNonExpired(true)
                    .accountNonLocked(true)
                    .credentialsNonExpired(true)
                    .build();

            User savedUser = userRepository.save(user);
            log.info("✅ User created: ID={}", savedUser.getId());

            // ✅ Create Patient Record
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setFirstName(savedUser.getFirstName());
            patient.setLastName(savedUser.getLastName());
            patient.setContactNumber(request.getPhoneNumber() != null ? request.getPhoneNumber() : "N/A");

            Patient savedPatient = patientRepository.save(patient);
            log.info("✅ Patient record created: PatientID={}", savedPatient.getPatientId());

            log.info("🟢 Patient registration successful: {}", request.getEmail());

        } catch (Exception e) {
            log.error("❌ Patient registration failed: {} - {}",
                    request != null ? request.getEmail() : "null request", e.getMessage(), e);
            throw new RuntimeException("Patient registration failed: " + e.getMessage());
        }
    }

    // -------------------- Password Reset --------------------
    @Override
    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        emailService.sendResetEmail(email, resetToken);
        log.info("✅ Password reset email sent to: {}", email);
    }

    @Override
    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token"));

        if (user.getResetTokenExpiry() == null || user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired");
        }

        if (!isValidPassword(newPassword)) {
            throw new RuntimeException("Password must be at least 8 characters with uppercase, lowercase, and number");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        emailService.sendPasswordChangedNotification(user.getEmail());
        log.info("✅ Password reset successfully for user: {}", user.getEmail());
    }

    // -------------------- Utility Methods --------------------
    private void updateLastLoginSafely(User user) {
        try {
            user.updateLastLogin();
            userRepository.save(user);
            log.debug("✅ Last login updated for user: {}", user.getEmail());
        } catch (Exception e) {
            log.warn("⚠️ Failed to update last login for user {}: {}",
                    user.getEmail(), e.getMessage());
        }
    }

    private void validateRegistrationRequest(RegisterRequest request) {
        if (request == null) throw new RuntimeException("Registration request cannot be null");
        if (!StringUtils.hasText(request.getFirstName())) throw new RuntimeException("First name is required");
        if (!StringUtils.hasText(request.getLastName())) throw new RuntimeException("Last name is required");
        if (!StringUtils.hasText(request.getEmail())) throw new RuntimeException("Email is required");
        if (!StringUtils.hasText(request.getPassword())) throw new RuntimeException("Password is required");
        if (!isValidEmail(request.getEmail())) throw new RuntimeException("Invalid email format");
        if (!isValidPassword(request.getPassword()))
            throw new RuntimeException("Password must be at least 8 characters long with uppercase, lowercase, and number");
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request == null) throw new RuntimeException("Login request cannot be null");
        if (!StringUtils.hasText(request.getIdentifier())) throw new RuntimeException("Username/Email cannot be empty");
        if (!StringUtils.hasText(request.getPassword())) throw new RuntimeException("Password cannot be empty");
    }

    private void validatePatientRegistrationRequest(PatientRegistrationRequest request) {
        if (request == null) throw new RuntimeException("Patient registration request cannot be null");
        if (!StringUtils.hasText(request.getFirstName())) throw new RuntimeException("First name is required");
        if (!StringUtils.hasText(request.getLastName())) throw new RuntimeException("Last name is required");
        if (!StringUtils.hasText(request.getEmail())) throw new RuntimeException("Email is required");
        if (!StringUtils.hasText(request.getPassword())) throw new RuntimeException("Password is required");
        if (!isValidEmail(request.getEmail())) throw new RuntimeException("Invalid email format");
        if (!isValidPassword(request.getPassword()))
            throw new RuntimeException("Password must be at least 8 characters long with uppercase, lowercase, and number");
    }

    private boolean isValidEmail(String email) {
        return email != null && email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }

    private boolean isValidPassword(String password) {
        return password != null
                && password.length() >= 8
                && password.matches(".*[A-Z].*")
                && password.matches(".*[a-z].*")
                && password.matches(".*\\d.*");
    }
}
