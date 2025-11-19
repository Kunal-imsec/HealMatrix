package com.hms.app.service;

import com.hms.app.dto.UserRequest;
import com.hms.app.dto.UserResponse;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserResponse createUser(UserRequest userRequest);

    List<UserResponse> getAllUsers();

    Optional<UserResponse> getUserById(Long id);

    UserResponse updateUser(Long id, UserRequest userRequest);

    void deleteUser(Long id);
}