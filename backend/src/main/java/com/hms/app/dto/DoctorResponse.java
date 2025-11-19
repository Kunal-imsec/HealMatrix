package com.hms.app.dto;

import com.hms.app.entity.Department;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponse {
    // IDs
    private Long id;
    private Long doctorId;

    // Personal Info
    private String firstName;
    private String lastName;
    private String fullName;
    private String email;

    // Contact
    private String contactNumber;

    // Professional Details
    private String specialization;
    private String qualification;
    private String experience;
    private String licenseNumber;

    // Department (multiple formats for compatibility)
    private Long departmentId;
    private String departmentName;
    private Department department; // Full object

    // Availability
    private Boolean available;
    private Boolean availableToday;
    private String status; // "ACTIVE", "INACTIVE", "ON_LEAVE"

    // Statistics
    private Double rating;
    private Integer appointmentCount;
    private Integer patientCount;
}
