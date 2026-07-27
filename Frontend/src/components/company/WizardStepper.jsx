import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'Basic Information', to: '/company/post-opportunity' },
  { label: 'Requirements & Eligibility', to: '/company/post-opportunity/requirements' },
  { label: 'Opportunity Description', to: '/company/post-opportunity/description' },
  { label: 'Preview & Publish', to: '/company/post-opportunity/preview' }
];

export default function WizardStepper({ currentStep }) {
  return (
    <div className="flex items-center">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isComplete = stepNum < currentStep;
        const isActive = stepNum === currentStep;
        return (
          <React.Fragment key={step.to}>
            <div className="flex items-center gap-2.5">
              <div
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors',
                  isComplete && 'bg-black text-white',
                  isActive && 'bg-black text-white',
                  !isComplete && !isActive && 'border border-gray-300 bg-white text-gray-400'
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  'text-xs font-medium sm:text-sm',
                  isActive ? 'text-black' : isComplete ? 'text-black' : 'text-gray-400'
                )}
              >
                {step.label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={cn(
                  'mx-2 h-px flex-1 min-w-[16px]',
                  stepNum < currentStep ? 'bg-black' : 'bg-gray-300'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}