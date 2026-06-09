'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewCard() {
  const [name, setName] = useState('')
  const [cardType, setCardType] = useState('points')
  const [primaryColor, setPrimaryColor] = useState('#1a1916')
  const [secondaryColor, setSecondaryColor] = useState('#ffffff')
  const [rewardDescription, setRewardDescription] = useState('')
  const [pointsPerEuro, setPointsPerEuro] = useState('1')
  const [maxStamps, setMaxStamps] = useState('10')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  function generateSlug(n: string) {
    return n.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Math.random().toString(36).substr(2, 5)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/'); return }
    const { data: merchant } = await supabase.from('merchants').select('id').eq('user_id', user.id).single()
    if (!merchant) { setError('Profil commerçant introuvable'); setLoading(false); return }
    const { error: insertError } = await supabase.from('loyalty_cards').insert({
      merchant_id: merchant.id, name, card_type: cardType,
      primary_color: primaryColor, secondary_color: secondaryColor,
      reward_description: rewardDescription,
      points_per_euro: parseFloat(pointsPerEuro),
      max_stamps: parseInt(maxStamps),
      slug: generateSlug(name),
    })
    if (insertError) { setError(insertError.message); setLoading(false); return }
    router.push('/dashboard')
  }

  const cardTypes = [
    { id: 'points', label: 'Points', desc: '1€ = X points', icon: '⭐' },
    { id: 'stamp', label: 'Tampons', desc: 'Carte à tamponner', icon: '🔖' },
    { id: 'membership', label: 'Abonnement', desc: 'Carte membre VIP', icon: '👑' }
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <header style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)', padding: '0 2rem', height: '60px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/dashboard" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m15 18-6-6 6-6"/></svg>
          Dashboard
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontWeight: 600, fontSize: '15px' }}>Nouvelle carte</span>
      </header>
      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '2.5rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '1.75rem' }}>Créer une carte de fidélité</h1>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>Nom de la carte *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Ex: Carte Or Boulangerie Martin"
                style={{ width: '100%', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '15px', background: 'var(--card)', color: 'var(--text)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Type de carte *</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cardTypes.map(t => (
                  <div key={t.id} onClick={() => setCardType(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: `2px solid ${cardType === t.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: '10px', cursor: 'pointer', background: cardType === t.id ? 'var(--accent-light)' : 'var(--card)' }}>
                    <span style={{ fontSize: '22px' }}>{t.icon}</span>
                    <div>
