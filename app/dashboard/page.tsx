'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type LoyaltyCard = { id: string; name: string; card_type: string; primary_color: string; secondary_color: string; is_active: boolean; slug: string; reward_description: string; created_at: string }
type Merchant = { business_name: string }

export default function Dashboard() {
  const [cards, setCards] = useState<LoyaltyCard[]>([])
  const [merchant, setMerchant] = useState<Merchant | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/'); return }
      const { data: merchantData } = await supabase.from('merchants').select('*').eq('user_id', user.id).single()
      setMerchant(merchantData)
      if (merchantData) {
        const { data: cardsData } = await supabase.from('loyalty_cards').select('*').eq('merchant_id', merchantData.id).order('created_at', { ascending: false })
        setCards(cardsData || [])
      }
      setLoading(false)
    }
    load()
  }, [])

  async function logout() { await supabase.auth.signOut(); router.push('/') }

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: 'var(--muted)' }}>Chargement...</div></div>

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="3"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '17px' }}>LoyalPass</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '14px', color: 'var(--muted)' }}>{merchant?.business_name}</span>
          <button onClick={logout} style={{ fontSize: '13px', color: 'var(--muted)', background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer' }}>Déconnexion</button>
        </div>
      </header>
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>Mes cartes de fidélité</h1>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginTop: '4px' }}>{cards.length} carte{cards.length !== 1 ? 's' : ''} créée{cards.length !== 1 ? 's' : ''}</p>
          </div>
          <Link href="/dashboard/new-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nouvelle carte
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {[{ label: 'Cartes actives', value: cards.filter(c => c.is_active).length }, { label: 'Types utilisés', value: [...new Set(cards.map(c => c.card_type))].length }, { label: 'Total cartes', value: cards.length }].map(stat => (
            <div key={stat.label} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem' }}>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
        {cards.length === 0 ? (
          <div style={{ background: 'var(--card)', border: '2px dashed var(--border)', borderRadius: '16px', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '1rem' }}>💳</div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '0.5rem' }}>Aucune carte pour l&apos;instant</h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '1.5rem' }}>Créez votre première carte de fidélité en quelques secondes</p>
            <Link href="/dashboard/new-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--accent)', color: 'white', borderRadius: '10px', padding: '10px 20px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Créer ma première carte</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: '1rem' }}>
            {cards.map(card => (
              <div key={card.id} style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ height: '100px', background: card.primary_color, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem' }}>
                  <div style={{ color: card.secondary_color, fontWeight: 700, fontSize: '16px' }}>{card.name}</div>
                  <div style={{ background: card.secondary_color, color: card.primary_color, borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                    {{ points: 'Points', stamp: 'Tampons', membership: 'Membre' }[card.card_type] || card.card_type}
                  </div>
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '13px', color: 'var(--muted)' }}>/{card.slug}</span>
                    <span style={{ fontSize: '12px', fontWeight: 500, padding: '3px 8px', borderRadius: '20px', background: card.is_active ? '#f0fdf4' : '#fafafa', color: card.is_active ? '#16a34a' : '#888' }}>
                      {card.is_active ? '● Actif' : '○ Inactif'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ flex: 1, padding: '8px', background: 'var(--accent-light)', color: 'var(--accent)', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>QR Code</button>
                    <Link href={`/dashboard/edit-card/${card.id}`} style={{ flex: 1, padding: '8px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', fontWeight: 500, cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>Modifier</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
