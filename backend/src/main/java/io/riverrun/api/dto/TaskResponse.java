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
public class TaskResponse {

    private UUID id;
    private UUID tenantId;
    private UUID caseId;
    private String title;
    private String description;
    private String status;
    private String priority;
    private UUID assignedTo;
    private String taskType;
    private Map<String, Object> formData;
    private LocalDateTime dueDate;
    private LocalDateTime completedAt;
    private UUID createdBy;
    private UUID updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
