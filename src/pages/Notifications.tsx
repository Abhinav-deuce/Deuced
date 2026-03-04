import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface NotificationData {
    id: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
    type: string;
    link: string;
}

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationData[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/notifications')
            .then(res => res.json())
            .then(data => setNotifications(data))
            .catch(err => console.error("Error fetching notifications:", err));
    }, []);

    return (
        <div style={{ flex: 1, backgroundColor: 'var(--bg-color)', minHeight: '100vh' }}>
            <header style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', background: 'var(--card-bg)', position: 'sticky', top: 0, zIndex: 10, borderBottom: '1px solid #e5e7eb' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: '1rem', display: 'flex' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="h2" style={{ margin: 0, fontSize: '1.25rem' }}>Notifications ({notifications.length})</h1>
            </header>

            <div>
                {notifications.map(notif => (
                    <div
                        key={notif.id}
                        onClick={() => notif.link && navigate(notif.link)}
                        style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid #e5e7eb',
                            backgroundColor: !notif.unread ? 'var(--card-bg)' : '#f0fdf4', // tinted background for unread
                            display: 'flex',
                            gap: '1rem',
                            cursor: notif.link ? 'pointer' : 'default',
                            position: 'relative'
                        }}
                    >
                        {/* Unread dot indicator */}
                        {notif.unread && (
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', position: 'absolute', left: '0.75rem', top: '2rem' }}></div>
                        )}

                        <div style={{ flex: 1, marginLeft: !notif.unread ? 0 : '0.5rem' }}>
                            <p style={{
                                margin: '0 0 0.5rem 0',
                                fontWeight: !notif.unread ? 400 : 700,
                                color: 'var(--text-main)',
                                lineHeight: 1.4
                            }}>
                                {notif.message}
                            </p>
                            <p className="text-muted" style={{ margin: 0 }}>{notif.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
}
