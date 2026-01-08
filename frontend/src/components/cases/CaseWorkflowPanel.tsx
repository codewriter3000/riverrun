import React, { useState } from 'react';
import { CaseWorkflowPanelTile } from './CaseWorkflowPanelTile';
import { CaseWorkflowPanelExpandableTile } from './CaseWorkflowPanelExpandableTile';

const mockStates = ['NEW', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED', 'CANCELLED'];
const mockCompleted = ['NEW', 'IN_PROGRESS'];
const mockTransitions = [
  { target: 'PENDING', label: 'Mark as Pending' },
  { target: 'RESOLVED', label: 'Resolve' },
];
const mockHistory = [
  { id: '1', from: 'NEW', to: 'IN_PROGRESS', label: 'Start Progress', timestamp: new Date().toISOString(), notes: 'Started work' },
  { id: '2', from: 'IN_PROGRESS', to: 'PENDING', label: 'Pause', timestamp: new Date().toISOString(), notes: 'Waiting for info' },
  { id: '3', from: 'PENDING', to: 'IN_PROGRESS', label: 'Resume', timestamp: new Date().toISOString() },
  { id: '4', from: 'IN_PROGRESS', to: 'RESOLVED', label: 'Resolve', timestamp: new Date().toISOString(), notes: 'Issue fixed' },
  { id: '5', from: 'RESOLVED', to: 'CLOSED', label: 'Close', timestamp: new Date().toISOString() },
  { id: '6', from: 'CLOSED', to: 'CANCELLED', label: 'Cancel', timestamp: new Date().toISOString(), notes: 'User request' },
];

export const CaseWorkflowPanel: React.FC = () => {
  const [error, setError] = useState<string | undefined>();
  const handleTransition = async (target: string, notes?: string) => {
    // Simulate error for demo
    if (target === 'CANCELLED') {
      setError('Cannot cancel a closed case.');
      return;
    }
    setError(undefined);
    // Simulate async
    await new Promise((res) => setTimeout(res, 500));
    alert(`Transition to ${target} with notes: ${notes || ''}`);
  };

  return (
    <div>
      <div>
        <CaseWorkflowPanelTile
          currentState="IN_PROGRESS"
          workflowStates={mockStates}
          completedStates={mockCompleted}
          availableTransitions={mockTransitions}
          onTransition={handleTransition}
          transitionError={error}
          transitionHistory={mockHistory}
        />
      </div>
      {/* <div style={{ flex: 1, minWidth: 400 }}>
        <h3>ExpandableTile Version</h3>
        <CaseWorkflowPanelExpandableTile
          currentState="IN_PROGRESS"
          workflowStates={mockStates}
          completedStates={mockCompleted}
          availableTransitions={mockTransitions}
          onTransition={handleTransition}
          transitionError={error}
          transitionHistory={mockHistory}
        />
      </div> */}
    </div>
  );
};
