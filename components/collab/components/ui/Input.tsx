import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm">{label}</label>}
      <input
        className="bg-zinc-800 border border-zinc-700 rounded-md p-2 w-full"
        {...props}
      />
    </div>
  );
};

export default Input;