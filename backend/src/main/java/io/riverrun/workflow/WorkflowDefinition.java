package io.riverrun.workflow;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * Represents a workflow definition with states and transitions.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowDefinition {

    private String id;
    private String name;
    private String description;
    private String initialState;
    private Map<String, StateDefinition> states;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StateDefinition {
        private String name;
        private String description;
        private List<TransitionDefinition> transitions;
        private List<String> allowedActions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TransitionDefinition {
        private String from;
        private String to;
        private String event;
        private List<GuardDefinition> guards;
        private List<ActionDefinition> actions;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GuardDefinition {
        private String rule;
        private Map<String, Object> parameters;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActionDefinition {
        private String type;
        private Map<String, Object> parameters;
    }

}
