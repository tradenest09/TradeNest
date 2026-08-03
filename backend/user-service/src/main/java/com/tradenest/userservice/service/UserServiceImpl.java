package com.tradenest.userservice.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
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
import com.tradenest.userservice.security.JwtService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
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
                .password(passwordEncoder.encode(request.getPassword()))
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
                .orElseThrow(() ->
                        new RuntimeException("Invalid Email or Password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid Email or Password");
        }

        String token = jwtService.generateToken(user.getEmail());

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
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

    @Override
    public UserResponse getUserByUname(String uname) {

        return userRepository.findByUname(uname)
                .map(this::mapToUserResponse)
                .orElseThrow(() ->
                        new RuntimeException("User not found : " + uname));
    }
    
    @Override
    public long getTotalUsers() {

        return userRepository.count();

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
}