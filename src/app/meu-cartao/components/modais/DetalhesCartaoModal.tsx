'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Modal } from './ModalWrapper';

export default function DetalhesCartaoModal({
  isOpen,
  onClose,
  cardNumber,
  validade,
  cvv,
}: {
  isOpen: boolean;
  onClose: () => void;
  cardNumber: string;
  validade: string;
  cvv: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes do Cartão">
      <div className="space-y-3 text-gray-800">
        <p><span className="font-medium">Número:</span> {cardNumber}</p>
        <p><span className="font-medium">Validade:</span> {validade}</p>
        <p><span className="font-medium">CVV/PIN:</span> {cvv}</p>
        <p className="text-xs text-red-600 mt-2">
          ⚠️ Mantenha essas informações em segurança. Nunca as compartilhe.
        </p>
      </div>
    </Modal>
  );
}