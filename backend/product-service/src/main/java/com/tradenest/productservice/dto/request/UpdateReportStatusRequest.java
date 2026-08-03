package com.tradenest.productservice.dto.request;

import com.tradenest.productservice.entities.ReportStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateReportStatusRequest {
    @NotNull
    private ReportStatus status;
}
