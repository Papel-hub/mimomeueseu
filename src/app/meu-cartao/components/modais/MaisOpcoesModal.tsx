'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faGift, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal } from './ModalWrapper';

export default function MaisOpcoesModal({
  isOpen,
  onClose,
  onAction,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}) {
  const opcoes = [
    { label: 'Crédito', icon: faCreditCard, key: 'credito' },
    { label: 'Presente', icon: faGift, key: 'presente' },
    { label: 'Converter', icon: faExchangeAlt, key: 'converter' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Mais Opções">
      <div className="grid grid-cols-1 gap-3">
        {opcoes.map((op) => (
          <button
            key={op.key}
            onClick={() => onAction(op.label)}
            className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-800 font-medium hover:bg-gray-50 transition"
          >
            <FontAwesomeIcon icon={op.icon} className="w-5 h-5 text-rose-600" />
            {op.label}
          </button>
        ))}
      </div>
    </Modal>
  );
}