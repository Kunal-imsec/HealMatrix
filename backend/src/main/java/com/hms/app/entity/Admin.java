package com.hms.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admins")
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String employeeId;

    private LocalDateTime hiredAt;

    // --- FIXED: Relationships ---
    // The User entity has 'id' as the primary key field, not 'userId'
    @OneToOne(cascade = {CascadeType.PERSIST, CascadeType.MERGE}, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")  // Fixed: reference 'id' not 'userId'
    private User user;

    // Constructor for easy creation
    public Admin(String employeeId, User user) {
        this.employeeId = employeeId;
        this.user = user;
        this.hiredAt = LocalDateTime.now();
    }
}