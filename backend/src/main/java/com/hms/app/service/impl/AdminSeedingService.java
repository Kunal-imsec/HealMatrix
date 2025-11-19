package com.hms.app.service.impl;

import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import com.hms.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminSeedingService implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@hospital.com}")
    private String adminEmail;

    @Value("${app.admin.password:Admin123!}")
    private String adminPassword;

    @Value("${app.admin.firstName:System}")
    private String adminFirstName;

    @Value("${app.admin.lastName:Administrator}")
    private String adminLastName;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("🌱 Starting Hospital Management System Admin Seeding...");
        log.info("📅 Started at: {}", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        try {
            seedAdminUser();
            logSystemStatus();

        } catch (Exception e) {
            log.error("❌ Error during admin seeding: {}", e.getMessage(), e);
            throw e;
        }

        log.info("✅ Admin seeding completed successfully!");
    }

    private void seedAdminUser() {
        log.info("👑 Checking admin user...");

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("ℹ️  Admin user already exists: {}", adminEmail);
            return; // ✅ FIXED: Removed password logging for existing admin
        }

        try {
            User adminUser = User.builder()
                    .firstName(adminFirstName)
                    .lastName(adminLastName)
                    .email(adminEmail)
                    .username("admin") // ✅ ADDED: Set username
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .enabled(true)
                    .accountNonExpired(true) // ✅ ADDED
                    .accountNonLocked(true)  // ✅ ADDED
                    .credentialsNonExpired(true) // ✅ ADDED
                    .build();

            userRepository.save(adminUser);

            log.info("✅ Admin user created successfully!");
            log.info("📧 Email: {}", adminEmail);
            log.info("👤 Username: admin");
            log.info("🔐 Password: {} (⚠️ CHANGE IN PRODUCTION!)", adminPassword);
            log.info("👤 Name: {} {}", adminFirstName, adminLastName);
            log.warn("⚠️⚠️⚠️ SECURITY WARNING: Change admin password immediately after first login!");

        } catch (Exception e) {
            log.error("❌ Failed to create admin user: {}", e.getMessage());
            throw new RuntimeException("Failed to seed admin user", e);
        }
    }

    private void logSystemStatus() {
        try {
            long totalUsers = userRepository.count();
            long adminCount = userRepository.countByRole(Role.ADMIN);

            log.info("📊 === SYSTEM STATUS ===");
            log.info("👥 Total Users: {}", totalUsers);
            log.info("👑 Admin Users: {}", adminCount);
            log.info("👑 Admin Ready: {}", userRepository.existsByEmail(adminEmail));
            log.info("🏥 Hospital Management System Ready!");
            log.info("📋 Staff (doctors, nurses) can be created by admin");
            log.info("👤 Patients can self-register");
            log.info("🌐 API Base URL: http://localhost:8080/api/v1");
            log.info("🔐 Login URL: http://localhost:8080/api/v1/auth/login");
            log.info("======================");

        } catch (Exception e) {
            log.warn("⚠️  Could not generate system status: {}", e.getMessage());
        }
    }

    // Method to check admin status (for other services)
    public boolean isAdminUserExists() {
        return userRepository.existsByEmail(adminEmail);
    }
}
