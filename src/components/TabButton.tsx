// app/components/TabButton.tsx
import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`px-4 py-2 font-medium rounded-full transition-colors ${
        isActive
          ? 'bg-red-900 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-red-800'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default TabButton;