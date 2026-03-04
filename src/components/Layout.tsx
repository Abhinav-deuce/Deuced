
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, Bell, MessageSquare, User } from 'lucide-react';

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { id: 'home', icon: Home, path: '/home' },
        { id: 'notifications', icon: Bell, path: '/notifications' },
        { id: 'matches', icon: MessageSquare, path: '/matches' },
        { id: 'profile', icon: User, path: '/profile' }
    ];

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Main Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px', backgroundColor: 'var(--bg-color)' }}>
                <Outlet />
            </div>

            {/* Bottom Navigation */}
            <nav style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '64px',
                backgroundColor: 'var(--secondary)',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
                padding: '0 1rem',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                boxShadow: '0 -4px 10px rgba(0,0,0,0.1)'
            }}>
                {navItems.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.path)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: isActive ? 'var(--primary)' : '#9ca3af',
                                cursor: 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '0.5rem'
                            }}
                        >
                            <item.icon size={28} strokeWidth={isActive ? 2.5 : 2} />
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Layout;
