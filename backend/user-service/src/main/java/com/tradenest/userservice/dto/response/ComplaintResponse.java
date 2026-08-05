package com.tradenest.userservice.dto.response;

import com.tradenest.userservice.enums.ComplaintStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintResponse {
    private Integer complaintId;
    private Integer uid;
    private String subject;
    private String description;
    private ComplaintStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
