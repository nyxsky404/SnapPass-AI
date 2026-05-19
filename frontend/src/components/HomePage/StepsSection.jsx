import React from "react";

const StepsSection = ({ steps }) => {
  return (
    <section className="steps-section" aria-labelledby="steps-title">
      <h2 id="steps-title" className="text-center section-title">
        How It Works
      </h2>
      <p className="text-center section-subtitle">
        Four simple steps to a print-ready sheet
      </p>
      <div className="steps-grid">
        {steps.map(({ label, icon, subtitle }) => (
          <div key={label} className="step-card">
            <span className="step-card__icon">{icon}</span>
            <div className="step-card__content">
              <p className="step-card__label">{label}</p>
              <p className="step-card__subtitle">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StepsSection;
