package com.tradenest.userservice.controller;

import com.tradenest.userservice.dto.request.AddComplaintRequest;
import com.tradenest.userservice.dto.response.ApiResponse;
import com.tradenest.userservice.dto.response.ComplaintResponse;
import com.tradenest.userservice.enums.ComplaintStatus;
import com.tradenest.userservice.service.ComplaintService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/complaints")

public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    public ResponseEntity<ComplaintResponse> addComplaint(@RequestBody AddComplaintRequest request) {
        return new ResponseEntity<>(complaintService.addComplaint(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @GetMapping("/user/{uid}")
    public ResponseEntity<List<ComplaintResponse>> getComplaintsByUser(@PathVariable Integer uid) {
        return ResponseEntity.ok(complaintService.getComplaintsByUser(uid));
    }

    @PutMapping("/{complaintId}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Integer complaintId,
            @RequestBody Map<String, String> request) {
        ComplaintStatus status = ComplaintStatus.valueOf(request.get("status").toUpperCase());
        return ResponseEntity.ok(complaintService.updateStatus(complaintId, status));
    }

    @DeleteMapping("/{complaintId}")
    public ResponseEntity<ApiResponse> deleteComplaint(@PathVariable Integer complaintId) {
        return ResponseEntity.ok(complaintService.deleteComplaint(complaintId));
    }
}

