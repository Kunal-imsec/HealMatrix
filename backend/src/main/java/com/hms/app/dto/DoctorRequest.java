package com.hms.app.dto;

import lombok.Data;

@Data
public class DoctorRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String password;  // ADD THIS
    private String phone;     // ADD THIS
    private String specialization;
    private String qualification;  // ADD THIS
    private String experience;     // ADD THIS
    private String department;     // ADD THIS (or departmentId)
    private Long departmentId;
    private String licenseNumber;  // ADD THIS
}