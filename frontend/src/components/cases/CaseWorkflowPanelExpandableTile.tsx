import React, { useState } from 'react';
import {
  ExpandableTile,
  Button,
  ProgressIndicator,
  ProgressStep,
  Modal,
  TextArea,
  InlineNotification,
} from '@carbon/react';
import CaseStatusBadge from './CaseStatusBadge';
import type { Transition, CaseWorkflowPanelProps } from './CaseWorkflowPanelTile';

export const CaseWorkflowPanelExpandableTile: React.FC<CaseWorkflowPanelProps> = ({
  currentState,
  workflowStates,
  completedStates,
  availableTransitions,
  onTransition,
  transitionError,
  transitionHistory,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransition, setSelectedTransition] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransition = async () => {
    if (!selectedTransition) return;
    setLoading(true);
    try {
      await onTransition(selectedTransition, notes);
      setModalOpen(false);
      setNotes('');
    } finally {
      setLoading(false);
    }
  };

  const last5Transitions = transitionHistory.slice(-5).reverse();

  return (
    <ExpandableTile expanded={false}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 8 }}>
          Current State
        </div>
        <CaseStatusBadge status={currentState as any} style={{ fontSize: '1.5rem', padding: '0.5rem 2rem' }} />
      </div>
      <ProgressIndicator currentIndex={workflowStates.indexOf(currentState)}>
        {workflowStates.map((state, idx) => (
          <ProgressStep
            key={state}
            label={state}
            complete={completedStates.includes(state)}
            current={state === currentState}
          />
        ))}
      </ProgressIndicator>
      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Available Transitions:</div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {availableTransitions.map((t) => (
            <Button
              key={t.target}
              size="lg"
              kind="primary"
              onClick={() => {
                setSelectedTransition(t.target);
                setModalOpen(true);
              }}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>
      <Modal
        open={modalOpen}
        modalHeading="Confirm State Transition"
        primaryButtonText="Confirm"
        secondaryButtonText="Cancel"
        onRequestClose={() => setModalOpen(false)}
        onRequestSubmit={handleTransition}
        primaryButtonDisabled={loading}
      >
        <TextArea
          labelText="Transition Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
        />
        {transitionError && (
          <InlineNotification
            kind="error"
            title="Transition Error"
            subtitle={transitionError}
            hideCloseButton
          />
        )}
      </Modal>
      <div style={{ marginTop: '2rem' }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>Recent Transitions:</div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {last5Transitions.map((tr) => (
            <li key={tr.id} style={{ marginBottom: 8 }}>
              <span style={{ fontWeight: 500 }}>{tr.label}</span> from <b>{tr.from}</b> to <b>{tr.to}</b> at {new Date(tr.timestamp).toLocaleString()}
              {tr.notes && <span style={{ color: '#888', marginLeft: 8 }}>(Notes: {tr.notes})</span>}
            </li>
          ))}
        </ul>
      </div>
    </ExpandableTile>
  );
};
