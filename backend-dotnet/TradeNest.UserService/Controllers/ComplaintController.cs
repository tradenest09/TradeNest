using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TradeNest.UserService.DTOs;
using TradeNest.UserService.Entities;
using TradeNest.UserService.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace TradeNest.UserService.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/complaints")]
    public class ComplaintController : ControllerBase
    {
        private readonly IComplaintService _complaintService;

        public ComplaintController(IComplaintService complaintService)
        {
            _complaintService = complaintService;
        }

        [HttpPost]
        public async Task<IActionResult> AddComplaint([FromBody] AddComplaintRequest request)
        {
            try
            {
                var response = await _complaintService.AddComplaintAsync(request);
                return Created("", response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllComplaints()
        {
            return Ok(await _complaintService.GetAllComplaintsAsync());
        }

        [HttpGet("user/{uid}")]
        public async Task<IActionResult> GetComplaintsByUser(int uid)
        {
            return Ok(await _complaintService.GetComplaintsByUserAsync(uid));
        }

        [HttpPut("{complaintId}/status")]
        public async Task<IActionResult> UpdateStatus(int complaintId, [FromBody] UpdateComplaintStatusRequest request)
        {
            try
            {
                if(!Enum.TryParse<ComplaintStatus>(request.Status.ToUpper(), out var status))
                {
                    return BadRequest(new { message = "Invalid status" });
                }
                var response = await _complaintService.UpdateStatusAsync(complaintId, status);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("{complaintId}")]
        public async Task<IActionResult> DeleteComplaint(int complaintId)
        {
            try
            {
                var response = await _complaintService.DeleteComplaintAsync(complaintId);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
