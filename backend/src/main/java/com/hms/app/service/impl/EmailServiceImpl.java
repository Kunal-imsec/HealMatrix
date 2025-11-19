package com.hms.app.service.impl;

import com.hms.app.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    // Make JavaMailSender optional - will be null if bean not available
    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@hospital.com}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void sendResetEmail(String toEmail, String resetToken) {
        if (mailSender == null) {
            log.warn("⚠️ Email service not configured. Password reset email NOT sent to: {}", toEmail);
            log.warn("📧 Reset token for testing: {}", resetToken);
            log.warn("🔗 Reset link would be: {}/reset-password?token={}", frontendUrl, resetToken);
            return;  // Skip sending email in development
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request - Hospital Management System");

            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;

            String emailBody = String.format(
                    "Dear User,\n\n" +
                            "You have requested to reset your password for Hospital Management System.\n\n" +
                            "Please click the link below to reset your password:\n%s\n\n" +
                            "This link will expire in 1 hour.\n\n" +
                            "If you did not request this password reset, please ignore this email.\n\n" +
                            "Best regards,\n" +
                            "Hospital Management System Team",
                    resetLink
            );

            message.setText(emailBody);
            mailSender.send(message);

            log.info("✅ Password reset email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send reset email to: {} - {}", toEmail, e.getMessage());
            throw new RuntimeException("Failed to send reset email: " + e.getMessage());
        }
    }

    @Override
    public void sendWelcomeEmail(String toEmail, String username) {
        if (mailSender == null) {
            log.warn("⚠️ Email service not configured. Welcome email NOT sent to: {}", toEmail);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to Hospital Management System");

            String emailBody = String.format(
                    "Dear %s,\n\n" +
                            "Welcome to Hospital Management System!\n\n" +
                            "Your account has been created successfully.\n" +
                            "You can now log in using your email and password.\n\n" +
                            "Best regards,\n" +
                            "Hospital Management System Team",
                    username
            );

            message.setText(emailBody);
            mailSender.send(message);

            log.info("✅ Welcome email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send welcome email to: {} - {}", toEmail, e.getMessage());
            // Don't throw exception - welcome email is not critical
        }
    }

    @Override
    public void sendPasswordChangedNotification(String toEmail) {
        if (mailSender == null) {
            log.warn("⚠️ Email service not configured. Password changed notification NOT sent to: {}", toEmail);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Changed - Hospital Management System");

            String emailBody =
                    "Dear User,\n\n" +
                            "Your password has been changed successfully.\n\n" +
                            "If you did not make this change, please contact support immediately.\n\n" +
                            "Best regards,\n" +
                            "Hospital Management System Team";

            message.setText(emailBody);
            mailSender.send(message);

            log.info("✅ Password changed notification sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("❌ Failed to send password changed notification to: {} - {}", toEmail, e.getMessage());
            // Don't throw exception - notification is not critical
        }
    }
}
