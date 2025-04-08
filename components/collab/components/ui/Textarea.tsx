import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm">{label}</label>}
      <textarea
        className="bg-zinc-800 border-zinc-700 rounded-md p-2 w-full"
        {...props}
      />
    </div>
  );
};

export default Textarea;