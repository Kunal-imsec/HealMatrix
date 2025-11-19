package com.hms.app.service;

public interface EmailService {
    void sendResetEmail(String toEmail, String resetToken);
    void sendWelcomeEmail(String toEmail, String username);
    void sendPasswordChangedNotification(String toEmail);
}
