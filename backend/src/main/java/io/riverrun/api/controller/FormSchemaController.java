package io.riverrun.api.controller;

import io.riverrun.api.dto.FormSchemaRequest;
import io.riverrun.api.dto.FormSchemaResponse;
import io.riverrun.domain.model.FormSchema;
import io.riverrun.domain.repository.FormSchemaRepository;
import io.riverrun.forms.FormValidationService;
import io.riverrun.multitenancy.TenantContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/forms")
@RequiredArgsConstructor
@Slf4j
public class FormSchemaController {

    private final FormSchemaRepository formSchemaRepository;
    private final FormValidationService formValidationService;
    private final TenantContext tenantContext;

    @GetMapping
    public ResponseEntity<List<FormSchemaResponse>> getAllFormSchemas() {
        List<FormSchema> schemas = formSchemaRepository.findAll();
        return ResponseEntity.ok(schemas.stream()
                .map(this::toResponse)
                .collect(Collectors.toList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormSchemaResponse> getFormSchema(@PathVariable UUID id) {
        return formSchemaRepository.findByIdAndActiveTrue(id)
                .map(schema -> ResponseEntity.ok(toResponse(schema)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<FormSchemaResponse> getFormSchemaByCode(@PathVariable String code) {
        return formSchemaRepository.findByCodeAndActiveTrue(code)
                .map(schema -> ResponseEntity.ok(toResponse(schema)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<FormSchemaResponse> createFormSchema(@RequestBody FormSchemaRequest request) {
        FormSchema schema = FormSchema.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .schema(request.getSchema())
                .uiSchema(request.getUiSchema())
                .version(request.getVersion() != null ? request.getVersion() : "1.0.0")
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        schema.setTenantId(tenantContext.getCurrentTenant());
        FormSchema saved = formSchemaRepository.save(schema);

        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormSchemaResponse> updateFormSchema(
            @PathVariable UUID id,
            @RequestBody FormSchemaRequest request) {

        return formSchemaRepository.findById(id)
                .map(schema -> {
                    schema.setName(request.getName());
                    schema.setDescription(request.getDescription());
                    schema.setSchema(request.getSchema());
                    schema.setUiSchema(request.getUiSchema());
                    if (request.getVersion() != null) {
                        schema.setVersion(request.getVersion());
                    }
                    if (request.getActive() != null) {
                        schema.setActive(request.getActive());
                    }

                    FormSchema saved = formSchemaRepository.save(schema);
                    return ResponseEntity.ok(toResponse(saved));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/validate")
    public ResponseEntity<Map<String, Object>> validateFormData(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> formData) {

        return formSchemaRepository.findByIdAndActiveTrue(id)
                .map(schema -> {
                    FormValidationService.ValidationResult result =
                            formValidationService.validate(schema.getSchema(), formData);

                    return ResponseEntity.ok(Map.of(
                            "valid", result.isValid(),
                            "errors", result.getErrors()
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormSchema(@PathVariable UUID id) {
        return formSchemaRepository.findById(id)
                .map(schema -> {
                    schema.setActive(false);
                    formSchemaRepository.save(schema);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private FormSchemaResponse toResponse(FormSchema schema) {
        return FormSchemaResponse.builder()
                .id(schema.getId())
                .tenantId(schema.getTenantId())
                .name(schema.getName())
                .code(schema.getCode())
                .description(schema.getDescription())
                .schema(schema.getSchema())
                .uiSchema(schema.getUiSchema())
                .version(schema.getVersion())
                .active(schema.getActive())
                .createdAt(schema.getCreatedAt())
                .updatedAt(schema.getUpdatedAt())
                .build();
    }

}
