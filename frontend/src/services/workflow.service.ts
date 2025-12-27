// Workflow service
import api, { buildQueryString } from './api';
import {
  WorkflowDefinition,
  AvailableTransition,
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