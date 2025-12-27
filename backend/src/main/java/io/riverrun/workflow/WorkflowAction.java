package io.riverrun.workflow;

import java.util.Map;

/**
 * Interface for workflow actions that execute during transitions.
 */
@FunctionalInterface
public interface WorkflowAction {

    /**
     * Execute the action during a transition.
     *
     * @param context The workflow context with state and data
     * @param parameters Action configuration parameters
     */
    void execute(WorkflowContext context, Map<String, Object> parameters);

}
