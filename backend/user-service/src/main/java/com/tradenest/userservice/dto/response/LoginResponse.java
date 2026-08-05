package com.tradenest.userservice.dto.response;

import com.tradenest.userservice.enums.UserStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;

    private String type;

    private Integer uid;

    private String uname;

    private String email;

    private String contactNumber;

    private String fname;

    private String lname;

    private String role;

    private UserStatus status;

}