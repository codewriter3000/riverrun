package io.riverrun.domain.repository;

import io.riverrun.domain.model.FormSchema;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FormSchemaRepository extends JpaRepository<FormSchema, UUID> {

    Optional<FormSchema> findByCodeAndActiveTrue(String code);

    Optional<FormSchema> findByIdAndActiveTrue(UUID id);

}
