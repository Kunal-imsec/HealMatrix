package com.hms.app.exception;

import com.hms.app.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleDuplicateResourceException(DuplicateResourceException ex, WebRequest request) {
        log.error("Duplicate resource error: {}", ex.getMessage());

        ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false));
        ApiResponse<ErrorDetails> response = new ApiResponse<>("Resource already exists", errorDetails, false);

        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {
        log.error("Resource not found error: {}", ex.getMessage());

        ErrorDetails errorDetails = new ErrorDetails(new Date(), ex.getMessage(), request.getDescription(false));
        ApiResponse<ErrorDetails> response = new ApiResponse<>("Resource not found", errorDetails, false);

        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        log.error("Authentication error: {}", ex.getMessage());

        ErrorDetails errorDetails = new ErrorDetails(new Date(), "Invalid username/email or password", request.getDescription(false));
        ApiResponse<ErrorDetails> response = new ApiResponse<>("Authentication failed", errorDetails, false);

        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        log.error("Access denied error: {}", ex.getMessage());

        ErrorDetails errorDetails = new ErrorDetails(new Date(), "You don't have permission to access this resource", request.getDescription(false));
        ApiResponse<ErrorDetails> response = new ApiResponse<>("Access denied", errorDetails, false);

        return new ResponseEntity<>(response, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<ErrorDetails>> handleGlobalException(Exception ex, WebRequest request) {
        log.error("Unexpected error occurred: {}", ex.getMessage(), ex);

        ErrorDetails errorDetails = new ErrorDetails(new Date(), "An unexpected error occurred. Please try again later or contact support.", request.getDescription(false));
        ApiResponse<ErrorDetails> response = new ApiResponse<>("Internal server error", errorDetails, false);

        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // INNER CLASS - ErrorDetails
    public static class ErrorDetails {
        private Date timestamp;
        private String message;
        private String details;

        public ErrorDetails() {}

        public ErrorDetails(Date timestamp, String message, String details) {
            this.timestamp = timestamp;
            this.message = message;
            this.details = details;
        }

        // Getters and Setters
        public Date getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Date timestamp) {
            this.timestamp = timestamp;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getDetails() {
            return details;
        }

        public void setDetails(String details) {
            this.details = details;
        }
    }
}
