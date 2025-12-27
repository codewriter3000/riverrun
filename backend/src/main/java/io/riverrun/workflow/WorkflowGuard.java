package io.riverrun.workflow;

import java.util.Map;

/**
 * Interface for workflow guards that determine if a transition can occur.
 */
@FunctionalInterface
public interface WorkflowGuard {

    /**
     * Evaluate if the transition should be allowed.
     *
     * @param context The workflow context with state and data
     * @param parameters Guard configuration parameters
     * @return true if transition is allowed, false otherwise
     */
    boolean evaluate(WorkflowContext context, Map<String, Object> parameters);

}
