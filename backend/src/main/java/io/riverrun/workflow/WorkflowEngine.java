package io.riverrun.workflow;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * State machine engine for executing workflow transitions.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowEngine {

    private final WorkflowGuardRegistry guardRegistry;
    private final WorkflowActionRegistry actionRegistry;

    /**
     * Execute a workflow transition.
     *
     * @param definition The workflow definition
     * @param context The execution context
     * @return Result of the transition
     */
    public TransitionResult executeTransition(WorkflowDefinition definition, WorkflowContext context) {
        log.debug("Executing transition from {} to {} for entity {}",
            context.getCurrentState(), context.getTargetState(), context.getEntityId());

        // Validate current state exists
        WorkflowDefinition.StateDefinition currentState = definition.getStates().get(context.getCurrentState());
        if (currentState == null) {
            return TransitionResult.failure("Current state not found: " + context.getCurrentState());
        }

        // Find applicable transition
        WorkflowDefinition.TransitionDefinition transition = findTransition(currentState, context);
        if (transition == null) {
            return TransitionResult.failure("No valid transition found from " +
                context.getCurrentState() + " to " + context.getTargetState());
        }

        // Evaluate guards
        if (transition.getGuards() != null) {
            for (WorkflowDefinition.GuardDefinition guardDef : transition.getGuards()) {
                WorkflowGuard guard = guardRegistry.getGuard(guardDef.getRule());
                if (!guard.evaluate(context, guardDef.getParameters())) {
                    log.debug("Guard {} failed for transition", guardDef.getRule());
                    return TransitionResult.failure("Guard condition not met: " + guardDef.getRule());
                }
            }
        }

        // Execute actions
        if (transition.getActions() != null) {
            for (WorkflowDefinition.ActionDefinition actionDef : transition.getActions()) {
                try {
                    WorkflowAction action = actionRegistry.getAction(actionDef.getType());
                    action.execute(context, actionDef.getParameters());
                } catch (Exception e) {
                    log.error("Error executing action: " + actionDef.getType(), e);
                    return TransitionResult.failure("Action execution failed: " + e.getMessage());
                }
            }
        }

        log.info("Transition successful: {} -> {} for entity {}",
            context.getCurrentState(), context.getTargetState(), context.getEntityId());

        return TransitionResult.success(context.getTargetState());
    }

    /**
     * Get available transitions from current state.
     *
     * @param definition The workflow definition
     * @param currentState The current state
     * @return List of available target states
     */
    public List<String> getAvailableTransitions(WorkflowDefinition definition, String currentState) {
        WorkflowDefinition.StateDefinition state = definition.getStates().get(currentState);
        if (state == null || state.getTransitions() == null) {
            return List.of();
        }

        return state.getTransitions().stream()
            .map(WorkflowDefinition.TransitionDefinition::getTo)
            .distinct()
            .toList();
    }

    /**
     * Validate a workflow definition.
     *
     * @param definition The workflow definition to validate
     * @return Validation result
     */
    public ValidationResult validate(WorkflowDefinition definition) {
        if (definition.getInitialState() == null || definition.getInitialState().isEmpty()) {
            return ValidationResult.invalid("Initial state is required");
        }

        if (definition.getStates() == null || definition.getStates().isEmpty()) {
            return ValidationResult.invalid("At least one state is required");
        }

        if (!definition.getStates().containsKey(definition.getInitialState())) {
            return ValidationResult.invalid("Initial state not found in states: " + definition.getInitialState());
        }

        // Validate all transition target states exist
        for (var entry : definition.getStates().entrySet()) {
            WorkflowDefinition.StateDefinition state = entry.getValue();
            if (state.getTransitions() != null) {
                for (WorkflowDefinition.TransitionDefinition transition : state.getTransitions()) {
                    if (!definition.getStates().containsKey(transition.getTo())) {
                        return ValidationResult.invalid("Transition target state not found: " + transition.getTo());
                    }
                }
            }
        }

        return ValidationResult.valid();
    }

    private WorkflowDefinition.TransitionDefinition findTransition(
            WorkflowDefinition.StateDefinition currentState,
            WorkflowContext context) {

        if (currentState.getTransitions() == null) {
            return null;
        }

        return currentState.getTransitions().stream()
            .filter(t -> t.getTo().equals(context.getTargetState()))
            .filter(t -> context.getEvent() == null || context.getEvent().equals(t.getEvent()))
            .findFirst()
            .orElse(null);
    }

    /**
     * Result of a transition attempt.
     */
    public static class TransitionResult {
        private final boolean success;
        private final String newState;
        private final String errorMessage;

        private TransitionResult(boolean success, String newState, String errorMessage) {
            this.success = success;
            this.newState = newState;
            this.errorMessage = errorMessage;
        }

        public static TransitionResult success(String newState) {
            return new TransitionResult(true, newState, null);
        }

        public static TransitionResult failure(String errorMessage) {
            return new TransitionResult(false, null, errorMessage);
        }

        public boolean isSuccess() {
            return success;
        }

        public String getNewState() {
            return newState;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }

    /**
     * Result of workflow validation.
     */
    public static class ValidationResult {
        private final boolean valid;
        private final String errorMessage;

        private ValidationResult(boolean valid, String errorMessage) {
            this.valid = valid;
            this.errorMessage = errorMessage;
        }

        public static ValidationResult valid() {
            return new ValidationResult(true, null);
        }

        public static ValidationResult invalid(String errorMessage) {
            return new ValidationResult(false, errorMessage);
        }

        public boolean isValid() {
            return valid;
        }

        public String getErrorMessage() {
            return errorMessage;
        }
    }

}
