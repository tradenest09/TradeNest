package com.tradenest.userservice.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tradenest.userservice.dto.request.LoginRequest;
import com.tradenest.userservice.dto.request.RegisterUserRequest;
import com.tradenest.userservice.dto.request.UpdateUserRequest;
import com.tradenest.userservice.dto.response.ApiResponse;
import com.tradenest.userservice.dto.response.LoginResponse;
import com.tradenest.userservice.dto.response.UserResponse;
import com.tradenest.userservice.service.UserService;


@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

	private final UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping("/register")
	public ResponseEntity<UserResponse> registerUser(@RequestBody RegisterUserRequest request) {

		UserResponse response = userService.registerUser(request);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest request) {

		LoginResponse response = userService.loginUser(request);

		return ResponseEntity.ok(response);
	}

	@GetMapping("/{uid}")
	public ResponseEntity<UserResponse> getUserById(@PathVariable Integer uid) {

		UserResponse response = userService.getUserById(uid);

		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<List<UserResponse>> getAllUsers() {

		List<UserResponse> users = userService.getAllUsers();

		return ResponseEntity.ok(users);
	}

	@PutMapping("/{uid}")
	public ResponseEntity<UserResponse> updateUser(@PathVariable Integer uid, @RequestBody UpdateUserRequest request) {

		UserResponse response = userService.updateUser(uid, request);

		return ResponseEntity.ok(response);
	}

	@DeleteMapping("/{uid}")
	public ResponseEntity<ApiResponse> deleteUser(@PathVariable Integer uid) {

		ApiResponse response = userService.deleteUser(uid);

		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/search")
	public ResponseEntity<UserResponse> getUserByUname(@RequestParam("uname") String uname){
		
		UserResponse response =userService.getUserByUname(uname);
		return ResponseEntity.ok(response);
	}
}

