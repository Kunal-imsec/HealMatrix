package com.hms.app.repository;

import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // =========================
    // BASIC FINDERS
    // =========================
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByResetToken(String resetToken);

    // ✅ ADDED: Case-insensitive email finder
    @Query("SELECT u FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    Optional<User> findByEmailIgnoreCase(@Param("email") String email);

    // =========================
    // EXISTENCE CHECKS
    // =========================
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);

    // Case-insensitive existence checks
    @Query("SELECT COUNT(u) > 0 FROM User u WHERE LOWER(u.email) = LOWER(:email)")
    boolean existsByEmailIgnoreCase(@Param("email") String email);

    @Query("SELECT COUNT(u) > 0 FROM User u WHERE LOWER(u.username) = LOWER(:username)")
    boolean existsByUsernameIgnoreCase(@Param("username") String username);

    // =========================
    // AUTHENTICATION SUPPORT
    // =========================
    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:identifier) OR LOWER(u.email) = LOWER(:identifier)")
    Optional<User> findByUsernameOrEmailIgnoreCase(@Param("identifier") String identifier);

    @Query("SELECT u FROM User u WHERE u.username = :identifier OR u.email = :identifier")
    Optional<User> findByUsernameOrEmail(@Param("identifier") String identifier);

    // =========================
    // USER STATUS & ROLE QUERIES
    // =========================
    @Query("SELECT u FROM User u WHERE u.enabled = true")
    List<User> findActiveUsers();

    List<User> findByRole(Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") Role role);

    long countByEnabledTrue();

    @Query("SELECT COUNT(u) FROM User u WHERE u.role IN :roles")
    long countByRoleIn(@Param("roles") List<Role> roles);

    // =========================
    // ADMIN / DEBUGGING UTILITIES
    // =========================
    @Query("SELECT u.username FROM User u WHERE u.username IS NOT NULL")
    List<String> findAllUsernames();

    @Query("SELECT u.email FROM User u")
    List<String> findAllEmails();
}
