interface Props {
  description: string;
}

export default function EventDescription({ description }: Props) {
  return (
    <div className="mt-6 p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Detalhes do Evento</h2>
      <p className="whitespace-pre-line text-gray-700">{description}</p>
    </div>
  );
}