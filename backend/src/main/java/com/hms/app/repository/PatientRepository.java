package com.hms.app.repository;

import com.hms.app.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByUserId(Long userId);

    // ✅ ADDED: Find patient by user ID (alternative method name)
    @Query("SELECT p FROM Patient p WHERE p.user.id = :userId")
    Optional<Patient> findByUser_Id(@Param("userId") Long userId);

    @Query("SELECT p FROM Patient p LEFT JOIN FETCH p.user")
    List<Patient> findAllWithUser();

    @Query("SELECT p FROM Patient p JOIN p.user u WHERE " +
            "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Patient> searchPatients(@Param("search") String search);

    List<Patient> findByBloodGroup(String bloodGroup);
}
