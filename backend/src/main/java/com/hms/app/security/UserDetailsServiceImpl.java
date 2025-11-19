package com.hms.app.security;

import com.hms.app.entity.User;
import com.hms.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("=== LOADING USER BY USERNAME ===");
        log.info("Attempting to load user with username: '{}'", username);

        try {
            // Try to find user by username first, then by email
            User user = userRepository.findByUsernameOrEmailIgnoreCase(username)
                    .orElseThrow(() -> {
                        log.error("User not found with username: '{}'", username);

                        // Debug: List available usernames and emails
                        log.info("Available users in database:");
                        userRepository.findAll().forEach(u ->
                                log.info("  - Username: '{}', Email: '{}'", u.getUsername(), u.getEmail())
                        );

                        return new UsernameNotFoundException("User not found with username: " + username);
                    });

            log.info("✓ User found in database:");
            log.info("  - ID: {}", user.getUserId());
            log.info("  - Username: '{}'", user.getUsername());
            log.info("  - Email: '{}'", user.getEmail());
            log.info("  - Role: {}", user.getRole());
            log.info("  - Active: {}", user.isActive());

            return user;

        } catch (Exception e) {
            log.error("Error loading user: {}", e.getMessage(), e);
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
    }
}