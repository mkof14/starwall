"use client";

import { useState } from "react";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  testId?: string;
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete = "current-password",
  testId = "auth-password",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className="mt-4 block text-sm" htmlFor={id}>
      <span className="text-[#55687A]">{label}</span>
      <span className="relative mt-1 block">
        <input
          id={id}
          data-testid={testId}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          className="w-full border-b border-stroke bg-transparent px-0 py-2 pe-11 text-ink outline-none focus:border-orange"
        />
        <button
          type="button"
          data-testid={`${testId}-toggle`}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute end-2 top-1/2 -translate-y-1/2 p-1 text-[#55687A] hover:text-navyText"
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
    </label>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M12 5c5.2 0 9.3 3.3 10.7 7-1.4 3.7-5.5 7-10.7 7S2.7 15.7 1.3 12C2.7 8.3 6.8 5 12 5Zm0 2.2C8.2 7.2 5 9.6 3.8 12 5 14.4 8.2 16.8 12 16.8S19 14.4 20.2 12C19 9.6 15.8 7.2 12 7.2Zm0 2.1A2.7 2.7 0 1 1 12 14.7 2.7 2.7 0 0 1 12 9.3Z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path
        fill="currentColor"
        d="M3.3 2.3 21.7 20.7l-1.4 1.4-3.2-3.2A12.4 12.4 0 0 1 12 21C6.8 21 2.7 17.7 1.3 14c.7-1.8 2.1-3.5 4-4.8L1.9 3.7 3.3 2.3ZM12 7.2c1.1 0 2.1.2 3 .7L13.2 9.7A2.7 2.7 0 0 0 9.7 13.2L8 14.9c-.6-.8-1-1.8-1-2.9A4 4 0 0 1 12 7.2Zm8.4 1.1c1.2 1.1 2.1 2.4 2.6 3.7-1.4 3.7-5.5 7-10.7 7-.8 0-1.6-.1-2.4-.2l1.8-1.8c.2 0 .4.1.6.1 3.8 0 7-2.4 8.2-4.8-.5-1-1.3-2-2.4-2.8l1.6-1.6c.5.4.9.8 1.3 1.4Z"
      />
    </svg>
  );
}
