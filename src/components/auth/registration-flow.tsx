"use client";

import { useState } from "react";
import { RegistrationSelector } from "./registration-selector";
import { RegistrationForm } from "./registration-form";

type UserType = "prompt_engineer" | "company";

export function RegistrationFlow() {
  const [step, setStep] = useState<"select" | "register">("select");
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(null);

  const handleSelectUserType = (userType: UserType) => {
    setSelectedUserType(userType);
    setStep("register");
  };

  const handleBack = () => {
    setStep("select");
    setSelectedUserType(null);
  };

  if (step === "select") {
    return <RegistrationSelector onSelectUserType={handleSelectUserType} />;
  }

  if (step === "register" && selectedUserType) {
    return (
      <RegistrationForm 
        userType={selectedUserType} 
        onBack={handleBack} 
      />
    );
  }

  return null;
}
