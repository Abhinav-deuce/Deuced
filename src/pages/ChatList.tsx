
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Match {
    id: string;
    name: string;
    image: string;
    lastMessage: string;
    time: string;
    unreadCount: number;
    isOnline: boolean;
}

export default function ChatList() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState<Match[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/matches')
            .then(res => res.json())
            .then(data => setMatches(data))
            .catch(err => console.error("Error fetching matches:", err));
    }, []);

    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '1.5rem', background: 'var(--card-bg)', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e5e7eb' }}>
                <h1 className="h2" style={{ margin: 0, fontSize: '1.5rem' }}>Messages</h1>
            </header>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {matches.map(match => (
                    <div
                        key={match.id}
                        onClick={() => navigate(`/chat/${match.id}`)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1rem 1.5rem',
                            borderBottom: '1px solid #e5e7eb',
                            backgroundColor: 'var(--card-bg)',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ position: 'relative', marginRight: '1rem' }}>
                            <img src={match.image} alt={match.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                            {match.isOnline && (
                                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '14px', height: '14px', backgroundColor: 'var(--primary)', border: '2px solid white', borderRadius: '50%' }}></div>
                            )}
                        </div>

                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>{match.name}</span>
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{match.time}</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: match.unreadCount > 0 ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: match.unreadCount > 0 ? 600 : 400 }}>
                                {match.lastMessage}
                            </p>
                        </div>

                        {match.unreadCount > 0 && (
                            <div style={{ backgroundColor: 'var(--secondary)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, marginLeft: '0.5rem' }}>
                                {match.unreadCount}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
