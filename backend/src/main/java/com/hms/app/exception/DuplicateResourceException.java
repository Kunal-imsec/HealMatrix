package com.hms.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT) // Sets the HTTP status for this exception
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}
