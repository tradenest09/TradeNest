package com.tradenest.userservice.repository;


import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.tradenest.userservice.entity.User;



@Repository
public interface UserRepository extends JpaRepository<User, Integer>{
	   Optional<User> findByEmail(String email);

	    Optional<User> findByUname(String uname);

	    Optional<User> findByContactNumber(String contactNumber);

	    boolean existsByEmail(String email);

	    boolean existsByUname(String uname);

	    boolean existsByContactNumber(String contactNumber);
}
