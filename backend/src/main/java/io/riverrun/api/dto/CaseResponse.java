package io.riverrun.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CaseResponse {

    private UUID id;
    private UUID tenantId;
    private String caseNumber;
    private String caseType;
    private String title;
    private String description;
    private String status;
    private String priority;
    private UUID assignedTo;
    private Map<String, Object> customFields;
    private Map<String, Object> metadata;
    private LocalDateTime dueDate;
    private LocalDateTime resolvedAt;
    private LocalDateTime closedAt;
    private UUID createdBy;
    private UUID updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
