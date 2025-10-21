// emails/CardActivationEmail.tsx
export const CardActivationEmail = ({
  recipientName,
  isGift,
  activationLink,
  senderName,
  message,
}: {
  recipientName: string;
  isGift: boolean;
  activationLink: string;
  senderName?: string;
  message?: string;
}) => (
  <div style={{ fontFamily: 'sans-serif', lineHeight: 1.6, color: '#333' }}>
    <h2 style={{ color: '#d32f2f' }}>🎁 Seu cartão MIMO está pronto!</h2>

    <p>Olá, <strong>{recipientName}</strong>!</p>

    {isGift && senderName && (
      <p>
        <em>{senderName} te presenteou com um cartão MIMO!</em>
      </p>
    )}

{message && (
  <blockquote style={{ borderLeft: '3px solid #ddd', paddingLeft: '12px', margin: '16px 0' }}>
    &quot;{message}&quot;
  </blockquote>
)}
    <p>
      Clique no botão abaixo para ativar seu cartão:
    </p>

    <a
      href={activationLink}
      style={{
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#d32f2f',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        marginTop: '16px',
      }}
    >
      Ativar Cartão
    </a>

    <p style={{ fontSize: '0.9em', color: '#666', marginTop: '24px' }}>
      Este link é válido por 7 dias. Não compartilhe com ninguém.
    </p>
  </div>
);