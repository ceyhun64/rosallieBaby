import React from "react";
const StepIndicator = ({ step, currentStep, label, isLast }) => {
  const isActive = step === currentStep;
  const isCompleted = step < currentStep;

  return (
    <div className="flex items-center flex-1">
      <div className="flex flex-col items-center w-full">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
            isCompleted
              ? "bg-green-500 text-white shadow-md"
              : isActive
              ? "bg-blue-600 text-white shadow-lg ring-4 ring-blue-200"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          {isCompleted ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            step
          )}
        </div>
        <span
          className={`mt-2 text-center text-xs sm:text-sm font-medium transition-all duration-300 ${
            isActive
              ? "text-blue-600 font-bold"
              : isCompleted
              ? "text-green-600"
              : "text-gray-500"
          }`}
        >
          {label}
        </span>
      </div>
      
      {!isLast && (
        <div className="flex-1 h-1 mx-2 sm:mx-4 relative">
          <div className="absolute inset-0 bg-gray-200 rounded-full" />
          <div
            className={`absolute inset-0 rounded-full transition-all duration-500 ${
              isCompleted ? "bg-green-500" : "bg-gray-200"
            }`}
            style={{
              width: isCompleted ? "100%" : "0%",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default function PaymentStepper({ currentStep }) {
  const steps = [
    { number: 1, label: "Address Information" },
    { number: 2, label: "Shipping Selection" },
    { number: 3, label: "Payment Information" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <StepIndicator
            key={step.number}
            step={step.number}
            currentStep={currentStep}
            label={step.label}
            isLast={index === steps.length - 1}
          />
        ))}
      </div>
      
      <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
        />
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Step <span className="font-bold text-blue-600">{currentStep}</span> /{" "}
          <span className="font-semibold">{steps.length}</span>
        </p>
      </div>
    </div>
  );
}