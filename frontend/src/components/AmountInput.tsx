'use client';

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  disabled?: boolean;
  placeholder?: string;
}

export default function AmountInput({
  value,
  onChange,
  label,
  disabled = false,
  placeholder = '0.00',
}: AmountInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow empty
    if (input === '') {
      onChange('');
      return;
    }
    // Allow only valid decimal numbers
    if (/^\d*\.?\d*$/.test(input)) {
      // Prevent leading zeros (except 0.)
      if (input.startsWith('0') && input.length > 1 && !input.startsWith('0.')) {
        onChange(input.substring(1));
        return;
      }
      // Limit decimal places to 6
      const parts = input.split('.');
      if (parts[1] && parts[1].length > 6) {
        return;
      }
      onChange(input);
    }
  };

  const handleMaxClick = () => {
    // TODO: Get actual wallet balance
    onChange('1000.00');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {!disabled && (
          <button
            onClick={handleMaxClick}
            className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
          >
            MAX
          </button>
        )}
      </div>
      
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-2xl font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-gray-400"
      />
      
      {/* Validation feedback */}
      {value && parseFloat(value) === 0 && (
        <p className="mt-1 text-xs text-red-500 dark:text-red-400">
          Amount must be greater than 0
        </p>
      )}
      {/* Balance display (mock for now) */}
      {!disabled && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Balance: 1,000.00
        </p>
      )}
    </div>
  );
}
