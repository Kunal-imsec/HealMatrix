package com.hms.app.service;

import com.hms.app.enums.Role;

public interface RoutingService {
    String getRedirectUrlByRole(Role role);
    String getDashboardPathByRole(Role role);
    boolean hasAccessToPath(Role userRole, String requestedPath);
}
