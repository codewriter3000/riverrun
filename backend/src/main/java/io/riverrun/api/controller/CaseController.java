package io.riverrun.api.controller;

import io.riverrun.api.dto.CaseRequest;
import io.riverrun.api.dto.CaseResponse;
import io.riverrun.domain.model.Case;
import io.riverrun.domain.repository.CaseRepository;
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
@RequestMapping("/cases")
@RequiredArgsConstructor
@Slf4j
public class CaseController {

    private final CaseRepository caseRepository;
    private final TenantContext tenantContext;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<CaseResponse>> getAllCases(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) UUID assignedTo) {

        List<Case> cases;
        if (status != null && assignedTo != null) {
            cases = caseRepository.findByStatusAndAssignedTo(status, assignedTo);
        } else if (status != null) {
            cases = caseRepository.findByStatus(status);
        } else if (assignedTo != null) {
            cases = caseRepository.findByAssignedTo(assignedTo);
        } else {
            cases = caseRepository.findAll();
        }

        return ResponseEntity.ok(cases.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CaseResponse> getCaseById(@PathVariable UUID id) {
        return caseRepository.findById(id)
                .map(c -> ResponseEntity.ok(toResponse(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CaseResponse> createCase(
            @RequestBody CaseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Case caseEntity = Case.builder()
                .caseNumber(generateCaseNumber())
                .caseType(request.getCaseType())
                .title(request.getTitle())
                .description(request.getDescription())
                .status(request.getStatus() != null ? request.getStatus() : "NEW")
                .priority(request.getPriority())
                .assignedTo(request.getAssignedTo())
                .customFields(request.getCustomFields())
                .metadata(request.getMetadata())
                .dueDate(request.getDueDate())
                .build();

        caseEntity.setTenantId(tenantContext.getCurrentTenant());
        // TODO: Set createdBy from authenticated user

        Case saved = caseRepository.save(caseEntity);
        log.info("Created case: {} by user: {}", saved.getCaseNumber(), userDetails.getUsername());

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CaseResponse> updateCase(
            @PathVariable UUID id,
            @RequestBody CaseRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        return caseRepository.findById(id)
                .map(caseEntity -> {
                    if (request.getTitle() != null) caseEntity.setTitle(request.getTitle());
                    if (request.getDescription() != null) caseEntity.setDescription(request.getDescription());
                    if (request.getStatus() != null) caseEntity.setStatus(request.getStatus());
                    if (request.getPriority() != null) caseEntity.setPriority(request.getPriority());
                    if (request.getAssignedTo() != null) caseEntity.setAssignedTo(request.getAssignedTo());
                    if (request.getCustomFields() != null) caseEntity.setCustomFields(request.getCustomFields());
                    if (request.getMetadata() != null) caseEntity.setMetadata(request.getMetadata());
                    if (request.getDueDate() != null) caseEntity.setDueDate(request.getDueDate());

                    // Handle status transitions
                    if ("RESOLVED".equals(request.getStatus()) && caseEntity.getResolvedAt() == null) {
                        caseEntity.setResolvedAt(LocalDateTime.now());
                    }
                    if ("CLOSED".equals(request.getStatus()) && caseEntity.getClosedAt() == null) {
                        caseEntity.setClosedAt(LocalDateTime.now());
                    }

                    Case saved = caseRepository.save(caseEntity);
                    log.info("Updated case: {} by user: {}", saved.getCaseNumber(), userDetails.getUsername());
                    return ResponseEntity.ok(toResponse(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCase(@PathVariable UUID id) {
        return caseRepository.findById(id)
                .map(caseEntity -> {
                    caseRepository.delete(caseEntity);
                    log.info("Deleted case: {}", caseEntity.getCaseNumber());
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/transition")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<CaseResponse> transitionCaseState(
            @PathVariable UUID id,
            @RequestParam String targetState,
            @AuthenticationPrincipal UserDetails userDetails) {

        return caseRepository.findById(id)
                .map(caseEntity -> {
                    // TODO: Integrate with workflow engine for validation
                    caseEntity.setStatus(targetState);

                    if ("RESOLVED".equals(targetState)) {
                        caseEntity.setResolvedAt(LocalDateTime.now());
                    } else if ("CLOSED".equals(targetState)) {
                        caseEntity.setClosedAt(LocalDateTime.now());
                    }

                    Case saved = caseRepository.save(caseEntity);
                    log.info("Transitioned case {} to state {} by user {}",
                        saved.getCaseNumber(), targetState, userDetails.getUsername());
                    return ResponseEntity.ok(toResponse(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private CaseResponse toResponse(Case caseEntity) {
        return CaseResponse.builder()
                .id(caseEntity.getId())
                .tenantId(caseEntity.getTenantId())
                .caseNumber(caseEntity.getCaseNumber())
                .caseType(caseEntity.getCaseType())
                .title(caseEntity.getTitle())
                .description(caseEntity.getDescription())
                .status(caseEntity.getStatus())
                .priority(caseEntity.getPriority())
                .assignedTo(caseEntity.getAssignedTo())
                .customFields(caseEntity.getCustomFields())
                .metadata(caseEntity.getMetadata())
                .dueDate(caseEntity.getDueDate())
                .resolvedAt(caseEntity.getResolvedAt())
                .closedAt(caseEntity.getClosedAt())
                .createdBy(caseEntity.getCreatedBy())
                .updatedBy(caseEntity.getUpdatedBy())
                .createdAt(caseEntity.getCreatedAt())
                .updatedAt(caseEntity.getUpdatedAt())
                .build();
    }

    private String generateCaseNumber() {
        // Simple implementation - in production, use a more sophisticated approach
        return "CASE-" + System.currentTimeMillis();
    }

}
