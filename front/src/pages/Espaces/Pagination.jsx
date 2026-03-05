export default function Pagination({ pagination, page, onPage }) {
  if (!pagination || pagination.last_page <= 1) return null
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
      {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(p => (
        <button key={p} onClick={() => onPage(p)} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: p === page ? '#1a3a45' : 'transparent',
          color: p === page ? '#fff' : '#1a3a45',
          border: '1px solid rgba(26,58,69,0.2)',
          cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
          transition: 'all 0.2s',
        }}>
          {p}
        </button>
      ))}
    </div>
  )
}