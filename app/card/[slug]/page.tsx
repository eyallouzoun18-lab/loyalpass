import { createClient } from '@/lib/supabase'

export default async function CardPage({ params }: { params: { slug: string } }) {
  const supabase = createClient()
  const { data: card } = await supabase
    .from('loyalty_cards')
    .select('*, merchants(business_name)')
    .eq('slug', params.slug)
    .single()

  if (!card) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '1rem' }}>❌</div>
          <h1 style={{ fontSize: '20px', fontWeight: 700 }}>Carte introuvable</h1>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', marginBottom: '1.5rem' }}>
          <div style={{ background: card.primary_color, padding: '2rem', minHeight: '200px', position: 'relative' }}>
            <div style={{ color: card.secondary_color, fontSize: '13px', opacity: 0.7, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Carte de fidélité
            </div>
            <div style={{ color: card.secondary_color, fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
              {card.name}
            </div>
            <div style={{ color: card.secondary_color, fontSize: '14px', opacity: 0.8 }}>
              {card.merchants?.business_name}
            </div>
            <div style={{ marginTop: '2rem', color: card.secondary_color, fontSize: '13px', opacity: 0.7 }}>
              {card.reward_description}
            </div>
          </div>
          <div style={{ background: 'white', padding: '1.25rem' }}>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '4px' }}>Type</div>
            <div style={{ fontWeight: 600 }}>
              {{ points: '⭐ Points', stamp: '🔖 Tampons', membership: '👑 Abonnement' }[card.card_type as string] || card.card_type}
            </div>
          </div>
        </div>

        <button style={{ width: '100%', padding: '16px', background: 'black', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
          Ajouter à Apple Wallet
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '1rem' }}>
          Propulsé par LoyalPass
        </p>
      </div>
    </div>
  )
}
