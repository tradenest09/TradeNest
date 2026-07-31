package com.tradenest.userservice.dto.request;

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
public class RegisterUserRequest {

	private String uname;

	private String password;

	private String email;

	private String contactNumber;

	private String fname;

	private String lname;

}
