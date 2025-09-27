import React from 'react';

interface CheckboxProps {
  msg1: string;
  msg2: string;
  msg3: string;
  msg4: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ msg1, msg2, msg3, msg4, checked, onChange }) => {
  return (
    <div>
      <label className="flex items-center space-x-2 cursor-pointer select-none">
        {/* Hidden native checkbox */}
        <input
          id="checkbox"
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          className="hidden peer"
        />

        {/* Custom checkbox  */}
        <div
          className={`w-7 h-7 rounded-md flex items-center justify-center ${checked ? 'bg-primary' : 'bg-primary/10'} transition-colors duration-200`}
        >
          {checked && (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        <p className="text-primary/70 text-lg">
          {msg1}
          <a
            href="#"
            onClick={e => e.preventDefault()}
            className="text-primary font-semibold cursor-default hover:underline"
          >
            {msg2}
          </a>
          {msg3}
          <a
            href="#"
            onClick={e => e.preventDefault()}
            className="hover:underline text-primary cursor-default font-semibold"
          >
            {msg4}
          </a>
        </p>
      </label>
    </div>
  );
}

export default Checkbox