import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Check } from 'lucide-react';
import { formatChatTimestamp, hasRestrictedContent } from '../utils/chatUtils';

interface Message {
    id: number | string;
    chatId?: string;
    sender: string;
    text: string;
    date: string;
    read: boolean;
    systemAlert?: boolean;
}

export default function ChatDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');

    useEffect(() => {
        fetch(`http://localhost:3001/messages?chatId=${id}`)
            .then(res => res.json())
            .then(data => setMessages(data))
            .catch(err => console.error("Error fetching messages:", err));
    }, [id]);

    const targetName = id === '1' ? 'Sarah' : id === '2' ? 'Alex' : 'Mike'; // Keep mock names based on route for now

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        if (hasRestrictedContent(inputText)) {
            const blockedMsg = { id: Date.now(), chatId: id, sender: 'me', text: inputText, date: new Date().toISOString(), read: true };
            const systemMsg = { id: Date.now() + 1, chatId: id, sender: 'system', text: 'For your safety, please keep communication on Deuce.', date: new Date().toISOString(), read: true, systemAlert: true };

            setMessages(prev => [...prev, blockedMsg, systemMsg]);

            // Post system message
            fetch('http://localhost:3001/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(systemMsg)
            }).catch(console.error);

            setInputText('');
            return;
        }

        const newMsg = { id: Date.now().toString(), chatId: id, sender: 'me', text: inputText, date: new Date().toISOString(), read: true };

        // Optimistic UI update
        setMessages(prev => [...prev, newMsg]);
        setInputText('');

        // Persist to DB
        fetch('http://localhost:3001/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMsg)
        }).catch(console.error);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-color)', width: '100%', maxWidth: '430px', margin: '0 auto' }}>
            {/* Header */}
            <header style={{ padding: '1rem', display: 'flex', alignItems: 'center', background: 'var(--card-bg)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 10 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', marginRight: '1rem', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <ArrowLeft size={24} color="var(--secondary)" />
                </button>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="https://images.unsplash.com/photo-1522845015757-50bce044e5da?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80" alt="Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)', marginRight: '1rem' }} />
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>{targetName}</h2>
                        <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>● Online</span>
                    </div>
                </div>
            </header>

            {/* Message List */}
            <div style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    const isSystem = msg.sender === 'system' || msg.systemAlert;

                    return (
                        <div key={msg.id} style={{ alignSelf: isSystem ? 'center' : isMe ? 'flex-end' : 'flex-start', maxWidth: isSystem ? '100%' : '80%' }}>

                            {(!msg.systemAlert || msg.sender !== 'system') && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', marginBottom: '0.25rem' }}>
                                    <div style={{
                                        backgroundColor: isMe ? 'var(--secondary)' : '#e5e7eb',
                                        color: isMe ? 'white' : 'var(--text-main)',
                                        padding: '0.75rem 1rem',
                                        borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                        fontSize: '0.95rem',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                    }}>
                                        {msg.text}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{formatChatTimestamp(msg.date)}</span>
                                        {isMe && <Check size={14} color={msg.read ? 'var(--primary)' : 'var(--text-muted)'} />}
                                    </div>
                                </div>
                            )}

                            {msg.systemAlert && msg.sender === 'system' && (
                                <div style={{
                                    backgroundColor: '#fee2e2',
                                    color: 'var(--error)',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    fontSize: '0.85rem',
                                    textAlign: 'center',
                                    marginTop: '0.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: 600
                                }}>
                                    <span>❗</span> {msg.text}
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div style={{ padding: '1rem', background: 'var(--card-bg)', borderTop: '1px solid #e5e7eb' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '24px', padding: '0.5rem' }}>
                    <button type="button" style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', padding: '0 0.5rem' }}>😀</button>
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        style={{
                            flex: 1,
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            fontSize: '1rem',
                            padding: 0,
                            margin: 0
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        style={{
                            background: inputText.trim() ? 'var(--primary)' : '#d1d5db',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: inputText.trim() ? 'pointer' : 'default',
                            transition: 'background 0.2s'
                        }}
                    >
                        <Send size={20} color={inputText.trim() ? 'var(--secondary)' : 'white'} style={{ marginLeft: '2px' }} />
                    </button>
                </form>
            </div>

        </div>
    );
}
