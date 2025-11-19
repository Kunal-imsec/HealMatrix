package com.hms.app.dto;

import com.hms.app.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientResponse {
    private Long id;
    private String patientId;  // Formatted ID like "P-000001"
    private Long userId;

    // Personal Information
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;
    private LocalDate dateOfBirth;
    private Integer age;
    private Gender gender;

    // Contact Information
    private String phoneNumber;
    private String address;

    // Medical Information
    private String bloodGroup;
    private String emergencyContactName;
    private String emergencyContactNumber;

    // Status
    private String status;  // ACTIVE, INACTIVE, etc.
    private LocalDate lastVisit;
}
