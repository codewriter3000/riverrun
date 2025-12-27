// Form schema types
import { BaseEntity } from './common.types';

export interface FormSchemaRequest {
  name: string;
  code: string;
  description?: string;
  version: string;
  schema: Record<string, any>; // JSON Schema
  uiSchema?: Record<string, any>; // UI Schema for rendering hints
  active?: boolean;
}

export interface FormSchemaResponse extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  version: string;
  schema: Record<string, any>;
  uiSchema?: Record<string, any>;
  active: boolean;
}

export interface FormValidationRequest {
  formData: Record<string, any>;
}

export interface FormValidationResponse {
  valid: boolean;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: any;
}
