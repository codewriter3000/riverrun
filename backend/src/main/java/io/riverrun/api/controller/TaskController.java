package io.riverrun.api.controller;

import io.riverrun.api.dto.TaskRequest;
import io.riverrun.api.dto.TaskResponse;
import io.riverrun.domain.model.Case;
import io.riverrun.domain.model.Task;
import io.riverrun.domain.repository.CaseRepository;
import io.riverrun.domain.repository.TaskRepository;
import io.riverrun.multitenancy.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
@Slf4j
public class TaskController {

    private final TaskRepository taskRepository;
    private final CaseRepository caseRepository;
    private final TenantContext tenantContext;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam(required = false) UUID caseId,
            @RequestParam(required = false) UUID assignedTo,
            @RequestParam(required = false) String status) {

        List<Task> tasks;
        if (caseId != null) {
            tasks = taskRepository.findByCaseEntityId(caseId);
        } else if (assignedTo != null) {
            tasks = taskRepository.findByAssignedTo(assignedTo);
        } else if (status != null) {
            tasks = taskRepository.findByStatus(status);
        } else {
            tasks = taskRepository.findAll();
        }

        return ResponseEntity.ok(tasks.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<TaskResponse> getTaskById(@PathVariable UUID id) {
        return taskRepository.findById(id)
                .map(task -> ResponseEntity.ok(toResponse(task)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<TaskResponse> createTask(
            @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Case caseEntity = caseRepository.findById(request.getCaseId())
                .orElseThrow(() -> new RuntimeException("Case not found: " + request.getCaseId()));

        Task task = Task.builder()
                .caseEntity(caseEntity)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "OPEN")
                .priority(request.getPriority())
                .assignedTo(request.getAssignedTo())
                .taskType(request.getTaskType())
                .formData(request.getFormData())
                .dueDate(request.getDueDate())
                .build();

        task.setTenantId(tenantContext.getCurrentTenant());
        // TODO: Set createdBy from authenticated user

        Task saved = taskRepository.save(task);
        log.info("Created task: {} for case: {} by user: {}",
            saved.getId(), caseEntity.getCaseNumber(), userDetails.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID id,
            @RequestBody TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return taskRepository.findById(id)
                .map(task -> {
                    if (request.getTitle() != null) task.setTitle(request.getTitle());
                    if (request.getDescription() != null) task.setDescription(request.getDescription());
                    if (request.getStatus() != null) task.setStatus(request.getStatus());
                    if (request.getPriority() != null) task.setPriority(request.getPriority());
                    if (request.getAssignedTo() != null) task.setAssignedTo(request.getAssignedTo());
                    if (request.getTaskType() != null) task.setTaskType(request.getTaskType());
                    if (request.getFormData() != null) task.setFormData(request.getFormData());
                    if (request.getDueDate() != null) task.setDueDate(request.getDueDate());

                    Task saved = taskRepository.save(task);
                    log.info("Updated task: {} by user: {}", saved.getId(), userDetails.getUsername());
                    return ResponseEntity.ok(toResponse(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<TaskResponse> completeTask(
            @PathVariable UUID id,
            @RequestBody(required = false) TaskRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return taskRepository.findById(id)
                .map(task -> {
                    task.setStatus("COMPLETED");
                    task.setCompletedAt(LocalDateTime.now());

                    if (request != null && request.getFormData() != null) {
                        task.setFormData(request.getFormData());
                    }

                    Task saved = taskRepository.save(task);
                    log.info("Completed task: {} by user: {}", saved.getId(), userDetails.getUsername());
                    return ResponseEntity.ok(toResponse(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteTask(@PathVariable UUID id) {
        return taskRepository.findById(id)
                .map(task -> {
                    taskRepository.delete(task);
                    log.info("Deleted task: {}", task.getId());
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .tenantId(task.getTenantId())
                .caseId(task.getCaseEntity().getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .assignedTo(task.getAssignedTo())
                .taskType(task.getTaskType())
                .formData(task.getFormData())
                .dueDate(task.getDueDate())
                .completedAt(task.getCompletedAt())
                .createdBy(task.getCreatedBy())
                .updatedBy(task.getUpdatedBy())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }

}
