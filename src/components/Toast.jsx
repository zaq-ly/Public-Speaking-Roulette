import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import SwipeToast from './SwipeToast';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isSuccess = toast.type === 'success';

  return (
    <SwipeToast
      key={toast.id || toast.message}
      open={Boolean(toast)}
      title={toast.message}
      description={toast.description || ''}
      icon={
        isError ? (
          <AlertCircle className="w-[18px] h-[18px] text-red-500 shrink-0" />
        ) : isSuccess ? (
          <CheckCircle2 className="w-[18px] h-[18px] text-emerald-400 shrink-0" />
        ) : (
          <Info className="w-[18px] h-[18px] text-sky-400 shrink-0" />
        )
      }
      background="#18181b"
      color="#f4f4f5"
      fuseColor={isError ? '#ef4444' : isSuccess ? '#10b981' : '#38bdf8'}
      radius={14}
      duration={3500}
      closeButton={true}
      onClose={onClose}
    />
  );
}
