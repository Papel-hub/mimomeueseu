'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye,
  faArrowUp,
  faPaperPlane,

} from '@fortawesome/free-solid-svg-icons';

export default function AcoesCartao({
  onShowDetails,
  onAction,
}: {
  onShowDetails: () => void;
  onShowMore: () => void;
  onAction: (action: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={onShowDetails}
        className="flex items-center gap-3 px-4 py-3 w-[35%] rounded-full bg-rose-600 text-white font-medium hover:bg-rose-700 transition shadow-sm"
      >
        <FontAwesomeIcon icon={faEye} className="w-5 h-5" />
        Detalhes
      </button>
      <button
        onClick={() => onAction('Depositar')}
        className="flex items-center gap-3 px-4 py-3 w-[35%] rounded-full bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-sm"
      >
        <FontAwesomeIcon icon={faArrowUp} className="w-5 h-5" />
        Depositar
      </button>
      <button
        onClick={() => onAction('Enviar')}
        className="flex items-center gap-3 px-4 py-3 w-[35%] rounded-full bg-violet-600 text-white font-medium hover:bg-violet-700 transition shadow-sm"
      >
        <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
        Enviar
      </button>

    </div>
  );
}