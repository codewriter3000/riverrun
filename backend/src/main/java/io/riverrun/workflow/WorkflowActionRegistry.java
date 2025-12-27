package io.riverrun.workflow;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Registry for workflow actions. Actions are registered by type and can be looked up.
 */
@Component
@Slf4j
public class WorkflowActionRegistry {

    private final Map<String, WorkflowAction> actions = new HashMap<>();

    public WorkflowActionRegistry() {
        registerDefaultActions();
    }

    /**
     * Register an action with a type name.
     */
    public void register(String type, WorkflowAction action) {
        log.debug("Registering action: {}", type);
        actions.put(type, action);
    }

    /**
     * Get an action by type.
     */
    public WorkflowAction getAction(String type) {
        WorkflowAction action = actions.get(type);
        if (action == null) {
            log.warn("Action not found: {}", type);
            return (context, params) -> log.warn("No-op action executed for: {}", type);
        }
        return action;
    }

    /**
     * Register default actions.
     */
    private void registerDefaultActions() {
        // Log action
        register("log", (context, params) -> {
            String message = params != null ? (String) params.get("message") : "Workflow transition";
            log.info("Workflow action: {} - State: {} -> {}", message, context.getCurrentState(), context.getTargetState());
        });

        // Set field action
        register("setField", (context, params) -> {
            if (params != null && params.containsKey("field") && params.containsKey("value")) {
                String field = (String) params.get("field");
                Object value = params.get("value");
                context.setData(field, value);
                log.debug("Set field {} to {}", field, value);
            }
        });

        // Send notification (placeholder)
        register("sendNotification", (context, params) -> {
            String recipient = params != null ? (String) params.get("recipient") : null;
            String template = params != null ? (String) params.get("template") : null;
            log.info("Sending notification to {} using template {}", recipient, template);
            // TODO: Integrate with notification service
        });

        // Create task (placeholder)
        register("createTask", (context, params) -> {
            String taskType = params != null ? (String) params.get("taskType") : "default";
            log.info("Creating task of type: {}", taskType);
            // TODO: Integrate with task service
        });
    }

}
