package com.tradenest.userservice.serviceImpl;


import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.tradenest.userservice.dto.request.LoginRequest;
import com.tradenest.userservice.dto.request.RegisterUserRequest;
import com.tradenest.userservice.dto.request.UpdateUserRequest;
import com.tradenest.userservice.dto.response.ApiResponse;
import com.tradenest.userservice.dto.response.LoginResponse;
import com.tradenest.userservice.dto.response.UserResponse;
import com.tradenest.userservice.entity.Role;
import com.tradenest.userservice.entity.User;
import com.tradenest.userservice.enums.UserStatus;
import com.tradenest.userservice.repository.RoleRepository;
import com.tradenest.userservice.repository.UserRepository;
import com.tradenest.userservice.service.UserService;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public UserResponse registerUser(RegisterUserRequest request) {

        if (userRepository.existsByUname(request.getUname())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByContactNumber(request.getContactNumber())) {
            throw new RuntimeException("Contact number already exists");
        }

        Role role = roleRepository.findByRname("USER")
                .orElseThrow(() -> new RuntimeException("USER role not found"));

        User user = User.builder()
                .uname(request.getUname())
                .password(request.getPassword()) // BCrypt later
                .email(request.getEmail())
                .contactNumber(request.getContactNumber())
                .fname(request.getFname())
                .lname(request.getLname())
                .role(role)
                .status(UserStatus.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        return mapToUserResponse(savedUser);
    }

    @Override
    public LoginResponse loginUser(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Email"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid Password");
        }

        return LoginResponse.builder()
                .uid(user.getUid())
                .uname(user.getUname())
                .role(user.getRole().getRname())
                .message("Login Successful")
                .build();
    }

    @Override
    public UserResponse getUserById(Integer uid) {

        User user = userRepository.findById(uid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return mapToUserResponse(user);
    }

    @Override
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    @Override
    public UserResponse updateUser(Integer uid,
                                   UpdateUserRequest request) {

        User user = userRepository.findById(uid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFname(request.getFname());
        user.setLname(request.getLname());
        user.setContactNumber(request.getContactNumber());

        User updatedUser = userRepository.save(user);

        return mapToUserResponse(updatedUser);
    }

    @Override
    public ApiResponse deleteUser(Integer uid) {

        User user = userRepository.findById(uid)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);

        return ApiResponse.builder()
                .success(true)
                .message("User deleted successfully")
                .build();
    }

   
    private UserResponse mapToUserResponse(User user) {

        return UserResponse.builder()
                .uid(user.getUid())
                .uname(user.getUname())
                .email(user.getEmail())
                .contactNumber(user.getContactNumber())
                .fname(user.getFname())
                .lname(user.getLname())
                .role(user.getRole().getRname())
                .status(user.getStatus())
                .build();
    }

	@Override
	public UserResponse getUserByUname(String uname) {
		return userRepository.findByUname(uname)
				.map(this::mapToUserResponse)
				.orElseThrow(() -> new RuntimeException("User not found: " + uname));

		
	}
}
