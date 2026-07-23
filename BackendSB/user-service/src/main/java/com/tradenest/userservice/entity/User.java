package com.tradenest.userservice.entity;


import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.tradenest.userservice.enums.UserStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.ForeignKey;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "uid")
	private Integer uid;

	@Column(name = "uname", nullable = false, unique = true, length = 100)
	private String uname;

	@Column(name = "password", nullable = false, length = 255)
	private String password;

	@Column(name = "email", nullable = false, unique = true, length = 150)
	private String email;

	@Column(name = "contactnumber", nullable = false, unique = true, length = 15)
	private String contactNumber;

	@Column(name = "fname", nullable = false, length = 100)
	private String fname;

	@Column(name = "lname", nullable = false, length = 100)
	private String lname;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rid", nullable = false, foreignKey = @ForeignKey(name = "fk_user_role"))
	@JsonBackReference
	private Role role;

	@Column(name = "created_at", insertable = false, updatable = false)
	private LocalDateTime createdAt;

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	private UserStatus status;
}
