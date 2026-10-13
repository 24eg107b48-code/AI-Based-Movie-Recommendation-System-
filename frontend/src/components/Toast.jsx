import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="toast" onClick={onDismiss}>
      <CheckCircle2 size={18} color="#38bdf8" />
      <span>{message}</span>
    </div>
  );
}
