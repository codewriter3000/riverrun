package io.riverrun.forms;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonschema.core.exceptions.ProcessingException;
import com.github.fge.jsonschema.core.report.ProcessingReport;
import com.github.fge.jsonschema.main.JsonSchema;
import com.github.fge.jsonschema.main.JsonSchemaFactory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Service for validating form data against JSON schemas.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class FormValidationService {

    private final ObjectMapper objectMapper;
    private final JsonSchemaFactory schemaFactory = JsonSchemaFactory.byDefault();

    /**
     * Validate form data against a JSON schema.
     *
     * @param schema The JSON schema as a map
     * @param data The form data to validate
     * @return ValidationResult with success status and any error messages
     */
    public ValidationResult validate(Map<String, Object> schema, Map<String, Object> data) {
        try {
            JsonNode schemaNode = objectMapper.valueToTree(schema);
            JsonNode dataNode = objectMapper.valueToTree(data);

            JsonSchema jsonSchema = schemaFactory.getJsonSchema(schemaNode);
            ProcessingReport report = jsonSchema.validate(dataNode);

            if (report.isSuccess()) {
                return ValidationResult.success();
            }

            List<String> errors = new ArrayList<>();
            report.forEach(message -> errors.add(message.getMessage()));

            return ValidationResult.failure(errors);

        } catch (ProcessingException e) {
            log.error("Error validating form data", e);
            return ValidationResult.failure(List.of("Schema validation error: " + e.getMessage()));
        }
    }

    /**
     * Result of form validation.
     */
    public static class ValidationResult {
        private final boolean valid;
        private final List<String> errors;

        private ValidationResult(boolean valid, List<String> errors) {
            this.valid = valid;
            this.errors = errors != null ? errors : List.of();
        }

        public static ValidationResult success() {
            return new ValidationResult(true, null);
        }

        public static ValidationResult failure(List<String> errors) {
            return new ValidationResult(false, errors);
        }

        public boolean isValid() {
            return valid;
        }

        public List<String> getErrors() {
            return errors;
        }
    }

}
