package com.hms.app.service.impl;

import com.hms.app.dto.*;
import com.hms.app.entity.User;
import com.hms.app.enums.Role;
import com.hms.app.exception.ResourceNotFoundException;
import com.hms.app.repository.UserRepository;
import com.hms.app.service.DashboardService;
import com.hms.app.service.RoutingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final RoutingService routingService;

    @Override
    public AdminDashboardData getAdminDashboardData() {
        log.info("Fetching admin dashboard data");

        try {
            long totalUsers = userRepository.count();
            long totalDoctors = userRepository.countByRole(Role.DOCTOR);
            long totalPatients = userRepository.countByRole(Role.PATIENT);
            long totalNurses = userRepository.countByRole(Role.NURSE);

            List<AdminDashboardData.RecentActivity> activities = new ArrayList<>();
            activities.add(AdminDashboardData.RecentActivity.builder()
                    .action("User Registration")
                    .user("New Patient Registered")
                    .timestamp(LocalDateTime.now().minusHours(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                    .type("INFO")
                    .build());

            activities.add(AdminDashboardData.RecentActivity.builder()
                    .action("System Login")
                    .user("Admin User")
                    .timestamp(LocalDateTime.now().minusMinutes(30).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                    .type("SUCCESS")
                    .build());

            return AdminDashboardData.builder()
                    .welcomeMessage("Welcome to Admin Dashboard!")
                    .totalUsers((int) totalUsers)
                    .totalDoctors((int) totalDoctors)
                    .totalPatients((int) totalPatients)
                    .totalNurses((int) totalNurses)
                    .todayAppointments(0)
                    .redirectUrl(routingService.getRedirectUrlByRole(Role.ADMIN))
                    .recentActivities(activities)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching admin dashboard data: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch admin dashboard data: " + e.getMessage());
        }
    }

    @Override
    public DoctorDashboardData getDoctorDashboardData(String doctorEmail) {
        log.info("Fetching doctor dashboard data for: {}", doctorEmail);

        try {
            List<DoctorDashboardData.TodayAppointment> schedule = new ArrayList<>();
            schedule.add(DoctorDashboardData.TodayAppointment.builder()
                    .appointmentId(1L)
                    .patientName("Sample Patient")
                    .appointmentTime(LocalDateTime.now().plusHours(2))
                    .reason("Regular Checkup")
                    .status("SCHEDULED")
                    .build());

            return DoctorDashboardData.builder()
                    .welcomeMessage("Welcome, Doctor!")
                    .todayAppointments(1)
                    .upcomingAppointments(3)
                    .totalPatients(15)
                    .redirectUrl(routingService.getRedirectUrlByRole(Role.DOCTOR))
                    .todaysSchedule(schedule)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching doctor dashboard data: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch doctor dashboard data: " + e.getMessage());
        }
    }

    @Override
    public PatientDashboardData getPatientDashboardData(String patientEmail) {
        log.info("Fetching patient dashboard data for: {}", patientEmail);

        try {
            List<PatientDashboardData.UpcomingAppointment> appointments = new ArrayList<>();
            appointments.add(PatientDashboardData.UpcomingAppointment.builder()
                    .appointmentId(1L)
                    .doctorName("Dr. Smith")
                    .specialization("Cardiology")
                    .appointmentTime(LocalDateTime.now().plusDays(1))
                    .status("SCHEDULED")
                    .build());

            return PatientDashboardData.builder()
                    .welcomeMessage("Welcome to your Health Dashboard!")
                    .upcomingAppointments(1)
                    .nextAppointment(LocalDateTime.now().plusDays(1))
                    .nextAppointmentDoctor("Dr. Smith")
                    .redirectUrl(routingService.getRedirectUrlByRole(Role.PATIENT))
                    .appointments(appointments)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching patient dashboard data: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch patient dashboard data: " + e.getMessage());
        }
    }

    @Override
    public NurseDashboardData getNurseDashboardData(String nurseEmail) {
        log.info("Fetching nurse dashboard data for: {}", nurseEmail);

        try {
            List<NurseDashboardData.PatientTask> tasks = new ArrayList<>();
            tasks.add(NurseDashboardData.PatientTask.builder()
                    .taskId(1L)
                    .patientName("Sample Patient")
                    .taskType("Vital Signs Check")
                    .priority("HIGH")
                    .status("PENDING")
                    .build());

            return NurseDashboardData.builder()
                    .welcomeMessage("Welcome, Nurse!")
                    .assignedPatients(8)
                    .tasksToday(5)
                    .urgentTasks(2)
                    .redirectUrl(routingService.getRedirectUrlByRole(Role.NURSE))
                    .tasks(tasks)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching nurse dashboard data: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch nurse dashboard data: " + e.getMessage());
        }
    }

    @Override
    public UserProfile getUserProfile(String email) {
        log.info("Fetching user profile for: {}", email);

        try {
            User user = userRepository.findByUsernameOrEmailIgnoreCase(email)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            return UserProfile.builder()
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

        } catch (Exception e) {
            log.error("Error fetching user profile: {}", e.getMessage());
            throw new RuntimeException("Failed to fetch user profile: " + e.getMessage());
        }
    }
}
