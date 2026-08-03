package com.tradenest.productservice.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.tradenest.productservice.dto.request.UpdateReportStatusRequest;
import com.tradenest.productservice.dto.response.ReportResponse;
import com.tradenest.productservice.entities.Report;
import com.tradenest.productservice.repositories.ReportRepository;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reports")
public class ReportController {
    private final ReportRepository reportRepository;

    public ReportController(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @GetMapping
    public List<ReportResponse> getAll() {
        return reportRepository.findAll().stream().map(this::toResponse).toList();
    }

    @PutMapping("/{reportId}/status")
    public ResponseEntity<ReportResponse> updateStatus(@PathVariable Integer reportId,
            @Valid @RequestBody UpdateReportStatusRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
        report.setStatus(request.getStatus());
        return ResponseEntity.ok(toResponse(reportRepository.save(report)));
    }

    private ReportResponse toResponse(Report report) {
        return ReportResponse.builder().reportId(report.getReportId()).pid(report.getPid())
                .reporterId(report.getReporterId()).reason(report.getReason())
                .description(report.getDescription()).status(report.getStatus())
                .reportDate(report.getReportDate()).build();
    }
}
