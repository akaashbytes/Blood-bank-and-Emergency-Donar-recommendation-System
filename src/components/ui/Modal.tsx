import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1B1C1C]/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full border border-[#E2BEBC] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#FCF9F8] border-b border-[#E2BEBC]/60 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#1B1C1C]">{title}</h3>
            {subtitle && <p className="text-xs text-[#5A413F]">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#5A413F] hover:bg-[#F6F3F2] hover:text-[#1B1C1C] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-3.5 bg-[#F6F3F2] border-t border-[#E2BEBC]/60 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
