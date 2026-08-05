package com.tradenest.userservice.service;

import com.tradenest.userservice.dto.request.AddComplaintRequest;
import com.tradenest.userservice.dto.response.ApiResponse;
import com.tradenest.userservice.dto.response.ComplaintResponse;
import com.tradenest.userservice.entity.Complaint;
import com.tradenest.userservice.entity.User;
import com.tradenest.userservice.enums.ComplaintStatus;
import com.tradenest.userservice.repository.ComplaintRepository;
import com.tradenest.userservice.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public ComplaintServiceImpl(ComplaintRepository complaintRepository, UserRepository userRepository) {
        this.complaintRepository = complaintRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ComplaintResponse addComplaint(AddComplaintRequest request) {
        User user = userRepository.findById(request.getUid())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Complaint complaint = Complaint.builder()
                .user(user)
                .subject(request.getSubject())
                .description(request.getDescription())
                .status(ComplaintStatus.OPEN)
                .build();

        Complaint saved = complaintRepository.save(complaint);
        return mapToResponse(saved);
    }

    @Override
    public List<ComplaintResponse> getComplaintsByUser(Integer uid) {
        return complaintRepository.findByUserUid(uid).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ComplaintResponse updateStatus(Integer complaintId, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);
        if (status == ComplaintStatus.CLOSED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }
        Complaint updated = complaintRepository.save(complaint);
        return mapToResponse(updated);
    }

    @Override
    public ApiResponse deleteComplaint(Integer complaintId) {
        complaintRepository.deleteById(complaintId);
        return ApiResponse.builder().success(true).message("Complaint deleted successfully").build();
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        return ComplaintResponse.builder()
                .complaintId(complaint.getComplaintId())
                .uid(complaint.getUser().getUid())
                .subject(complaint.getSubject())
                .description(complaint.getDescription())
                .status(complaint.getStatus())
                .createdAt(complaint.getCreatedAt())
                .resolvedAt(complaint.getResolvedAt())
                .build();
    }
}
