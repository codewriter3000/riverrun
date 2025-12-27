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
public class FormSchemaResponse {

    private UUID id;
    private UUID tenantId;
    private String name;
    private String code;
    private String description;
    private Map<String, Object> schema;
    private Map<String, Object> uiSchema;
    private String version;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
