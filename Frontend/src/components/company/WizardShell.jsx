import React from 'react';
import WizardStepper from './WizardStepper';

export default function WizardShell({ currentStep, stepTitle, subtitle, children, footer }) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Post New Opportunity</h1>
        <p className="mt-1 text-sm text-gray-500">
          {subtitle || 'Fill in the details below to start recruiting top talent.'}
        </p>
      </div>

      <div className="mb-6 rounded-xl border border-[#E5E5E5] bg-white px-5 py-4">
        <WizardStepper currentStep={currentStep} />
      </div>

      <div className="rounded-xl border border-[#E5E5E5] bg-white">
        <div className="border-b border-[#E5E5E5] px-6 py-4">
          <h2 className="text-base font-semibold text-black">{stepTitle}</h2>
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="border-t border-[#E5E5E5] px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}