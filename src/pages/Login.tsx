
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
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ marginTop: '30vh', textAlign: 'center', width: '100%' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem', letterSpacing: '0.05em', color: 'var(--secondary)' }}>DEUCE</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Find Your Match</p>
            </div>

            <div style={{ marginBottom: '2rem', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => console.error("Login Failed")}
                        size="large"
                        shape="pill"
                        theme="outline"
                    />
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '250px' }}>
                    By continuing, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
}
