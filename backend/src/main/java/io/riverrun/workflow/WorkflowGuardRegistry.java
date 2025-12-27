package io.riverrun.workflow;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * Registry for workflow guards. Guards are registered by name and can be looked up.
 */
@Component
@Slf4j
public class WorkflowGuardRegistry {

    private final Map<String, WorkflowGuard> guards = new HashMap<>();

    public WorkflowGuardRegistry() {
        registerDefaultGuards();
    }

    /**
     * Register a guard with a name.
     */
    public void register(String name, WorkflowGuard guard) {
        log.debug("Registering guard: {}", name);
        guards.put(name, guard);
    }

    /**
     * Get a guard by name.
     */
    public WorkflowGuard getGuard(String name) {
        WorkflowGuard guard = guards.get(name);
        if (guard == null) {
            log.warn("Guard not found: {}", name);
            return (context, params) -> false;
        }
        return guard;
    }

    /**
     * Register default guards.
     */
    private void registerDefaultGuards() {
        // Always allow
        register("always", (context, params) -> true);

        // Has assignee
        register("hasAssignee", (context, params) -> {
            Object assignee = context.getData("assignedTo");
            return assignee != null;
        });

        // User is assignee
        register("isAssignee", (context, params) -> {
            Object assignee = context.getData("assignedTo");
            return assignee != null && assignee.equals(context.getUserId());
        });

        // Has required fields
        register("hasRequiredFields", (context, params) -> {
            if (params == null || !params.containsKey("fields")) {
                return true;
            }

            @SuppressWarnings("unchecked")
            java.util.List<String> requiredFields = (java.util.List<String>) params.get("fields");

            for (String field : requiredFields) {
                if (context.getData(field) == null) {
                    log.debug("Missing required field: {}", field);
                    return false;
                }
            }
            return true;
        });

        // Field equals value
        register("fieldEquals", (context, params) -> {
            if (params == null || !params.containsKey("field") || !params.containsKey("value")) {
                return false;
            }

            String field = (String) params.get("field");
            Object expectedValue = params.get("value");
            Object actualValue = context.getData(field);

            return expectedValue.equals(actualValue);
        });

        // User has role
        register("hasRole", (context, params) -> {
            if (params == null || !params.containsKey("role")) {
                return false;
            }

            @SuppressWarnings("unchecked")
            java.util.List<String> userRoles = (java.util.List<String>) context.getData("userRoles");
            String requiredRole = (String) params.get("role");

            return userRoles != null && userRoles.contains(requiredRole);
        });
    }

}
