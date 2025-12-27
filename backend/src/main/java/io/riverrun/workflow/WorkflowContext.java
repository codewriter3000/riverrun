package io.riverrun.workflow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Context object passed to guards and actions during workflow execution.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowContext {

    private UUID entityId;
    private String entityType;
    private String currentState;
    private String targetState;
    private String event;

    @Builder.Default
    private Map<String, Object> data = new HashMap<>();

    private UUID userId;
    private UUID tenantId;

    public Object getData(String key) {
        return data.get(key);
    }

    public void setData(String key, Object value) {
        data.put(key, value);
    }

}
