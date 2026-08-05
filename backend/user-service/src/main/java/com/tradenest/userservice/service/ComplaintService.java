package com.tradenest.userservice.service;

import com.tradenest.userservice.dto.request.AddComplaintRequest;
import com.tradenest.userservice.dto.response.ApiResponse;
import com.tradenest.userservice.dto.response.ComplaintResponse;
import com.tradenest.userservice.enums.ComplaintStatus;

import java.util.List;

public interface ComplaintService {
    ComplaintResponse addComplaint(AddComplaintRequest request);
    List<ComplaintResponse> getComplaintsByUser(Integer uid);
    List<ComplaintResponse> getAllComplaints();
    ComplaintResponse updateStatus(Integer complaintId, ComplaintStatus status);
    ApiResponse deleteComplaint(Integer complaintId);
}
