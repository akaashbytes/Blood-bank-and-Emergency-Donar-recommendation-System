import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  className,
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-[#5A413F] uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && <div className="absolute left-3 text-[#5A413F]">{icon}</div>}
        <input
          id={inputId}
          className={twMerge(
            clsx(
              'w-full h-11 px-3.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1B1C1C] placeholder-[#9CA3AF]',
              'focus:outline-none focus:border-[#8B0015] focus:ring-2 focus:ring-[#8B0015]/15 transition-all',
              icon && 'pl-10',
              error && 'border-[#B91C2A] focus:border-[#B91C2A] focus:ring-[#B91C2A]/15',
              className
            )
          )}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-[#B91C2A] font-medium">{error}</span>}
      {helperText && !error && <span className="text-xs text-[#5A413F]">{helperText}</span>}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className, id, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-[#5A413F] uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={twMerge(
          clsx(
            'w-full h-11 px-3.5 bg-white border border-[#D1D5DB] rounded-md text-sm text-[#1B1C1C]',
            'focus:outline-none focus:border-[#8B0015] focus:ring-2 focus:ring-[#8B0015]/15 transition-all',
            error && 'border-[#B91C2A]',
            className
          )
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-[#B91C2A] font-medium">{error}</span>}
    </div>
  );
};
