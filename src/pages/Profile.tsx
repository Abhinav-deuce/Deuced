
import Button from '../components/ui/Button';

const SUBSCRIPTION_TIERS = [
    { name: 'Freemium', price: 'Free', likes: 5, chats: 2, features: 'Core matching and chat', highlighted: false },
    { name: 'Tier 2', price: '₹1000/mo', likes: 15, chats: 5, features: 'Increased limits', highlighted: false },
    { name: 'Tier 1', price: '₹2000/mo', likes: 50, chats: 50, features: 'Date Suggestion, Setup Assistance', highlighted: true },
    { name: 'Metro', price: '₹10000/mo', likes: 'Unlimited', chats: 'Unlimited', features: 'Premium Support, Concierge Setup', highlighted: false },
];

export default function Profile() {
    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)', minHeight: '100vh', paddingBottom: '2rem' }}>
            <header style={{ padding: '1.5rem', background: 'var(--card-bg)', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>
                <h1 className="h2" style={{ margin: 0, fontSize: '1.5rem' }}>Sam's Profile</h1>
            </header>

            <div style={{ padding: '1.5rem' }}>

                {/* Profile Photos */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <img src="https://images.unsplash.com/photo-1541252876615-58da50d2eef2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '16px' }} />
                    <img src="https://images.unsplash.com/photo-1522845015757-50bce044e5da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '16px' }} />
                </div>

                {/* Selected Sports */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>My Sports</h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ padding: '0.5rem 1rem', background: 'var(--card-bg)', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #e5e7eb' }}>🎾 Tennis</span>
                        <span style={{ padding: '0.5rem 1rem', background: 'var(--card-bg)', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #e5e7eb' }}>🧘 Yoga</span>
                        <span style={{ padding: '0.5rem 1rem', background: 'var(--card-bg)', borderRadius: '24px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #e5e7eb' }}>🏊 Swimming</span>
                    </div>
                </div>

                <Button fullWidth style={{ marginBottom: '1rem' }}>
                    Edit Profile
                </Button>
                <Button fullWidth variant="outline" style={{ marginBottom: '2rem', borderColor: 'var(--secondary)' }}>
                    Settings
                </Button>

                {/* Subscription Plans */}
                <h2 className="h2" style={{ marginTop: '1rem', marginBottom: '1rem' }}>Upgrade Plan</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {SUBSCRIPTION_TIERS.map((tier, idx) => (
                        <div key={idx} style={{
                            background: tier.highlighted ? 'var(--secondary)' : 'var(--card-bg)',
                            color: tier.highlighted ? 'white' : 'var(--text-main)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            border: tier.highlighted ? '2px solid var(--primary)' : '1px solid #e5e7eb'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.25rem' }}>{tier.name}</h3>
                                    <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>{tier.features}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: tier.highlighted ? 'var(--primary)' : 'var(--text-main)' }}>{tier.price}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '1rem 0', borderTop: `1px solid ${tier.highlighted ? '#374151' : '#e5e7eb'}`, borderBottom: `1px solid ${tier.highlighted ? '#374151' : '#e5e7eb'}`, marginBottom: '1rem' }}>
                                <div style={{ textAlign: 'center', flex: 1 }}>
                                    <span style={{ display: 'block', fontWeight: 700, fontSize: '1.1rem' }}>{tier.likes}</span>
                                    <span style={{ opacity: 0.8 }}>Daily Likes</span>
                                </div>
                                <div style={{ width: '1px', background: tier.highlighted ? '#374151' : '#e5e7eb' }}></div>
                                <div style={{ textAlign: 'center', flex: 1 }}>
                                    <span style={{ display: 'block', fontWeight: 700, fontSize: '1.1rem' }}>{tier.chats}</span>
                                    <span style={{ opacity: 0.8 }}>Chats</span>
                                </div>
                            </div>

                            <Button fullWidth style={{
                                background: tier.highlighted ? 'var(--primary)' : 'transparent',
                                color: tier.highlighted ? 'var(--secondary)' : 'var(--secondary)',
                                border: tier.highlighted ? 'none' : '2px solid var(--secondary)',
                                padding: '0.5rem',
                                fontSize: '0.9rem'
                            }}>
                                {tier.name === 'Freemium' ? 'Current Plan' : 'Select Plan'}
                            </Button>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button style={{ background: 'none', border: 'none', color: 'var(--error)', fontWeight: 600, cursor: 'pointer' }}>
                        Log Out
                    </button>
                </div>

            </div>
        </div>
    );
}
