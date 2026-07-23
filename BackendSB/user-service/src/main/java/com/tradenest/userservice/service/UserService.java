package com.tradenest.userservice.service;

import java.util.List;

import com.tradenest.userservice.dto.request.LoginRequest;
import com.tradenest.userservice.dto.request.RegisterUserRequest;
import com.tradenest.userservice.dto.request.UpdateUserRequest;
import com.tradenest.userservice.dto.response.ApiResponse;
import com.tradenest.userservice.dto.response.LoginResponse;
import com.tradenest.userservice.dto.response.UserResponse;

public interface UserService {

	UserResponse registerUser(RegisterUserRequest request);

	LoginResponse loginUser(LoginRequest request);

	UserResponse getUserById(Integer uid);

	List<UserResponse> getAllUsers();

	UserResponse updateUser(Integer uid, UpdateUserRequest request);

	ApiResponse deleteUser(Integer uid);
}

