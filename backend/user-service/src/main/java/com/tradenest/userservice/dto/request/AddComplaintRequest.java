package com.tradenest.userservice.dto.request;

import lombok.Data;

@Data
public class AddComplaintRequest {
    private Integer uid;
    private String subject;
    private String description;
}
