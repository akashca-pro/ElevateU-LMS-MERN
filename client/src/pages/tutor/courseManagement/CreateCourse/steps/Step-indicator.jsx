import { CheckCircle2 } from "lucide-react";

/**
 * @param {Object} props
 * @param {number} props.currentStep
 * @param {number} props.totalSteps
 */
export function StepIndicator({ currentStep, totalSteps }) {
  const steps = [
    { id: 1, name: "Basic Details" },
    { id: 2, name: "Content" },
    { id: 3, name: "Pricing" },
    { id: 4, name: "Publish" },
  ];

  return (
    <div className="w-full">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between w-full">
          {steps.map((step, stepIdx) => (
            <li key={step.name} className="relative flex flex-col items-center">
              <div className="flex items-center">
                <div
                  className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    step.id <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  step.id <= currentStep ? "text-black font-semibold" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
              {stepIdx !== steps.length - 1 && (
                <div className="absolute top-full left-1/2 mt-2 h-0.5 w-full max-w-[100px] -translate-x-1/2 bg-gray-300">
                  <div
                    className="h-0.5 bg-primary transition-all"
                    style={{
                      width: step.id < currentStep ? "100%" : "0%",
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
