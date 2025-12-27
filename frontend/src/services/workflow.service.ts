// Workflow service
import api, { buildQueryString } from './api';
import {
  WorkflowDefinition,
} from '../types/workflow.types';

export const workflowService = {
  /**
   * Get all workflow definitions
   */
  getAll: async (params?: { active?: boolean }): Promise<WorkflowDefinition[]> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<WorkflowDefinition[]>(`/workflows${queryString}`);
    return response.data;
  },

  /**
   * Get workflow definition by ID
   */
  getById: async (id: string): Promise<WorkflowDefinition> => {
    const response = await api.get<WorkflowDefinition>(`/workflows/${id}`);
    return response.data;
  },

  /**
   * Get workflow definition by workflow ID
   */
  getByWorkflowId: async (workflowId: string): Promise<WorkflowDefinition> => {
    const response = await api.get<WorkflowDefinition>(`/workflows/workflowId/${workflowId}`);
    return response.data;
  },

  /**
   * Create new workflow definition
   */
  create: async (workflow: Partial<WorkflowDefinition>): Promise<WorkflowDefinition> => {
    const response = await api.post<WorkflowDefinition>('/workflows', workflow);
    return response.data;
  },

  /**
   * Update workflow definition
   */
  update: async (id: string, workflow: Partial<WorkflowDefinition>): Promise<WorkflowDefinition> => {
    const response = await api.put<WorkflowDefinition>(`/workflows/${id}`, workflow);
    return response.data;
  },

  /**
   * Delete workflow definition
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/workflows/${id}`);
  },
};