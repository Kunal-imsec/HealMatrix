package com.hms.app.service.impl;

import com.hms.app.enums.Role;
import com.hms.app.service.RoutingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Set;

@Slf4j
@Service
public class RoutingServiceImpl implements RoutingService {

    private static final Map<Role, String> ROLE_DASHBOARD_MAPPING = Map.of(
            Role.ADMIN, "/admin/dashboard",
            Role.DOCTOR, "/doctor/dashboard",
            Role.PATIENT, "/patient/dashboard",
            Role.NURSE, "/nurse/dashboard",
            Role.RECEPTIONIST, "/receptionist/dashboard"

    );

    private static final Map<Role, Set<String>> ROLE_ACCESS_MAPPING = Map.of(
            Role.ADMIN, Set.of("/admin", "/doctor", "/patient", "/nurse", "/receptionist", "/pharmacy", "/lab"),
            Role.DOCTOR, Set.of("/doctor", "/patient"),
            Role.PATIENT, Set.of("/patient"),
            Role.NURSE, Set.of("/nurse", "/patient"),
            Role.RECEPTIONIST,       Set.of("/receptionist", "/patient")
    );

    @Override
    public String getRedirectUrlByRole(Role role) {
        String redirectUrl = ROLE_DASHBOARD_MAPPING.getOrDefault(role, "/patient/dashboard");
        log.debug("Redirect URL for role {}: {}", role, redirectUrl);
        return redirectUrl;
    }

    @Override
    public String getDashboardPathByRole(Role role) {
        return ROLE_DASHBOARD_MAPPING.getOrDefault(role, "/patient/dashboard");
    }

    @Override
    public boolean hasAccessToPath(Role userRole, String requestedPath) {
        Set<String> allowedPaths = ROLE_ACCESS_MAPPING.getOrDefault(userRole, Set.of());
        boolean hasAccess = allowedPaths.stream()
                .anyMatch(requestedPath::startsWith);
        log.debug("Role {} access to path {}: {}", userRole, requestedPath, hasAccess);
        return hasAccess;
    }
}
