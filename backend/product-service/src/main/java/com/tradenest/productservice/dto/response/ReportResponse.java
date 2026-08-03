package com.tradenest.productservice.dto.response;

import java.time.LocalDateTime;
import com.tradenest.productservice.entities.ReportStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ReportResponse {
    private Integer reportId;
    private Integer pid;
    private Integer reporterId;
    private String reason;
    private String description;
    private ReportStatus status;
    private LocalDateTime reportDate;
}
