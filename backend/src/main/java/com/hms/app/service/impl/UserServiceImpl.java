package com.hms.app.service.impl;

import com.hms.app.dto.UserRequest;
import com.hms.app.dto.UserResponse;
import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import com.hms.app.repository.UserRepository;
import com.hms.app.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse createUser(UserRequest userRequest) {
        // Validate email uniqueness
        if (userRepository.existsByEmail(userRequest.getEmail())) {
            throw new RuntimeException("User with email " + userRequest.getEmail() + " already exists");
        }

        // Role assignment logic
        Role assignedRole = determineUserRole(userRequest.getRole());

        // Create user entity using setters
        User user = new User();
        user.setFirstName(userRequest.getFirstName());
        user.setLastName(userRequest.getLastName());
        user.setUsername(userRequest.getUsername());
        user.setEmail(userRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRequest.getPassword()));
        user.setRole(assignedRole);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);
        log.info("User created successfully: {} with role: {}", savedUser.getEmail(), savedUser.getRole());

        return convertToResponse(savedUser);
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<UserResponse> getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::convertToResponse);
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest userRequest) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update fields (don't update password here, have separate endpoint)
        existingUser.setFirstName(userRequest.getFirstName());
        existingUser.setLastName(userRequest.getLastName());
        existingUser.setEmail(userRequest.getEmail());
        if (userRequest.getUsername() != null) {
            existingUser.setUsername(userRequest.getUsername());
        }

        // Only admins can change roles
        if (isCurrentUserAdmin()) {
            existingUser.setRole(userRequest.getRole());
        }

        User updatedUser = userRepository.save(existingUser);
        return convertToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // Additional helper methods
    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public UserResponse convertToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setActive(user.isActive());
        response.setEnabled(user.isEnabled());
        response.setCreatedAt(user.getCreatedAt());
        response.setLastLoginAt(user.getLastLoginAt());
        return response;
    }

    // Role assignment logic based on current user and request
    private Role determineUserRole(Role requestedRole) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // If no authentication (public registration), assign PATIENT role by default
        if (auth == null || !auth.isAuthenticated()) {
            return Role.PATIENT;
        }

        // Get current user's role
        String currentUserRole = auth.getAuthorities().iterator().next().getAuthority();

        // Only ADMINs can create any role, others default to PATIENT
        if ("ROLE_ADMIN".equals(currentUserRole)) {
            return requestedRole != null ? requestedRole : Role.PATIENT;
        } else {
            // Non-admin users can only create PATIENT accounts
            return Role.PATIENT;
        }
    }

    private boolean isCurrentUserAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    // Method to change user password (separate from update)
    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    // Method to enable/disable users (admin only)
    public void toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }
}