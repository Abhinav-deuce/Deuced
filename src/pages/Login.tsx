
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            console.log("Token received", credentialResponse);
            const res = await fetch('http://localhost:3001/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential })
            });
            const data = await res.json();

            if (!res.ok) {
                alert("Login Error: " + (data.error || 'Server error'));
                return;
            }

            // If the user doesn't have an age (meaning they haven't finished onboarding)
            // Use optional chaining to prevent crashes
            if (data.isNew || !data.user?.age) {
                // Store email/name temporarily to use in Onboarding if needed
                localStorage.setItem('tempEmail', data.user?.email || '');
                localStorage.setItem('tempName', data.user?.name || '');
                navigate('/onboarding');
            } else {
                navigate('/home');
            }
        } catch (error: any) {
            console.error("Google Auth Error:", error);
            alert("Network Error: " + error.message);
        }
    };

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
            height: '100vh',
            backgroundColor: 'var(--card-bg)', // White theme
            color: 'var(--text-main)',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8vh'
        }}>
            <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/logo.png" alt="Deuce Logo" style={{ width: '120px', height: '120px', marginBottom: '0.25rem', borderRadius: '30px', objectFit: 'contain' }} />
                <h1 style={{ fontFamily: '"Poppins", sans-serif', fontSize: '3.5rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '0.05em', color: '#e23d3f', marginTop: 0 }}>Deuce</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: 0 }}>Game On. Love On.</p>
            </div>

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '1.5rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '320px', display: 'flex', justifyContent: 'center', transform: 'scale(1.2)', transformOrigin: 'top center', marginBottom: '1rem' }}>
                        <GoogleLogin
                            onSuccess={handleSuccess}
                            onError={() => console.error("Login Failed")}
                            size="large"
                            shape="pill"
                            theme="outline"
                            width="280"
                        />
                    </div>
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '250px' }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
