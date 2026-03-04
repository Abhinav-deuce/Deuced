import { useState } from 'react';
import { X, Heart, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Profile {
    id: string;
    name: string;
    age: number;
    sports: string[] | string;
    img?: string;
    image?: string;
    distance?: string;
}

export default function Home() {
    const [activeTab, setActiveTab] = useState<'discover' | 'interested'>('discover');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [interested, setInterested] = useState<Profile[]>([]);
    const navigate = useNavigate();

    import('react').then((React) => {
        React.useEffect(() => {
            fetch('http://localhost:3001/profiles')
                .then(res => res.json())
                .then(data => setProfiles(data))
                .catch(err => console.error("Error fetching profiles:", err));

            fetch('http://localhost:3001/interested')
                .then(res => res.json())
                .then(data => setInterested(data))
                .catch(err => console.error("Error fetching interested:", err));
        }, []);
    });

    const handleAction = () => {
        if (currentIndex < profiles.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            alert("No more profiles!");
        }
    };

    const currentProfile = profiles[currentIndex];

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Top Navigation */}
            <div style={{ padding: '1rem', background: 'var(--card-bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer' }} onClick={() => { }}>
                    <span style={{ fontSize: '1.25rem' }}>Preferences</span>
                </button>
                <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', background: '#f3f4f6', borderRadius: '24px', padding: '0.25rem' }}>
                    <button
                        style={{
                            backgroundColor: activeTab === 'discover' ? 'var(--secondary)' : 'transparent',
                            color: activeTab === 'discover' ? 'var(--primary)' : 'var(--text-main)',
                            padding: '0.5rem 1rem',
                            borderRadius: '24px',
                            border: 'none',
                            fontWeight: 700,
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('discover')}
                    >
                        Discover
                    </button>
                    <button
                        style={{
                            backgroundColor: activeTab === 'interested' ? 'var(--secondary)' : 'transparent',
                            color: activeTab === 'interested' ? 'var(--primary)' : 'var(--text-main)',
                            padding: '0.5rem 1rem',
                            borderRadius: '24px',
                            border: 'none',
                            fontWeight: 700,
                            transition: 'all 0.2s',
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('interested')}
                    >
                        Interested (5)
                    </button>
                </div>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }} onClick={() => navigate('/notifications')}>
                    <Bell size={24} color="var(--secondary)" />
                    <span style={{ position: 'absolute', top: 0, right: 0, width: '10px', height: '10px', backgroundColor: 'var(--error)', borderRadius: '50%' }}></span>
                </button>
            </div>

            <div style={{ flex: 1, padding: '1rem', position: 'relative', overflowY: 'auto' }}>
                {activeTab === 'discover' ? (
                    currentProfile ? (
                        /* Profile Card View */
                        <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 170px)', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                            <img
                                src={currentProfile.image || currentProfile.img}
                                alt={currentProfile.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                            />
                            {/* Gradient Overlay for Text */}
                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '2rem 1.5rem', color: 'white' }}>
                                <h2 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>{currentProfile.name}, {currentProfile.age}</h2>
                                <p style={{ margin: 0, fontSize: '1rem', opacity: 0.9 }}>
                                    {Array.isArray(currentProfile.sports) ? currentProfile.sports.join(' | ') : currentProfile.sports}
                                </p>
                            </div>

                            {/* CTAs Floating over card */}
                            <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', gap: '1rem' }}>
                                <button onClick={handleAction} style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#4b5563', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                                    <X size={30} color="white" />
                                </button>
                                <button onClick={handleAction} style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--primary)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
                                    <Heart size={30} color="var(--secondary)" fill="var(--secondary)" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', marginTop: '20vh' }}>Loading profiles...</div>
                    )
                ) : (
                    /* Interested List View */
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {interested.map(person => (
                            <div key={person.id} style={{ borderRadius: '16px', overflow: 'hidden', height: '220px', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <img src={person.image || person.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '1rem', color: 'white' }}>
                                    <span style={{ fontWeight: 700, display: 'block' }}>{person.name}, {person.age}</span>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                        {Array.isArray(person.sports) ? person.sports.join(' | ') : person.sports}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
