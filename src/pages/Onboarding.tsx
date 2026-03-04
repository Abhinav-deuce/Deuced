import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import { Plus, X as CloseIcon } from 'lucide-react';

// Mock list of sports
const AVAILABLE_SPORTS = [
    { id: 'tennis', label: 'Tennis', icon: '🎾' },
    { id: 'running', label: 'Running', icon: '🏃' },
    { id: 'soccer', label: 'Soccer', icon: '⚽' },
    { id: 'yoga', label: 'Yoga', icon: '🧘' },
    { id: 'gym', label: 'Gym', icon: '🏋️' },
    { id: 'cycling', label: 'Cycling', icon: '🚴' },
    { id: 'basketball', label: 'Basketball', icon: '🏀' },
    { id: 'swimming', label: 'Swimming', icon: '🏊' },
    { id: 'ufc', label: 'UFC', icon: '🥊' },
];

export default function Onboarding() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    // Form State
    const [profile, setProfile] = useState({
        name: 'Alex Developer', // Auto-filled mock
        age: '25', // Auto-filled mock
        gender: '',
        location: '',
        mobile: ''
    });

    const [preferences, setPreferences] = useState({
        genderPreference: '',
        datingRange: ''
    });

    const CITIES = [
        'Mumbai, Maharashtra', 'Delhi, Delhi', 'Bangalore, Karnataka', 'Hyderabad, Telangana',
        'Ahmedabad, Gujarat', 'Chennai, Tamil Nadu', 'Kolkata, West Bengal', 'Surat, Gujarat',
        'Pune, Maharashtra', 'Jaipur, Rajasthan', 'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh',
        'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Thane, Maharashtra', 'Bhopal, Madhya Pradesh',
        'Visakhapatnam, Andhra Pradesh', 'Pimpri-Chinchwad, Maharashtra', 'Patna, Bihar', 'Vadodara, Gujarat',
        'Ghaziabad, Uttar Pradesh', 'Ludhiana, Punjab', 'Agra, Uttar Pradesh', 'Nashik, Maharashtra',
        'Ranchi, Jharkhand', 'Faridabad, Haryana', 'Meerut, Uttar Pradesh', 'Rajkot, Gujarat',
        'Kalyan-Dombivli, Maharashtra', 'Vasai-Virar, Maharashtra', 'Varanasi, Uttar Pradesh', 'Srinagar, Jammu & Kashmir',
        'Aurangabad, Maharashtra', 'Dhanbad, Jharkhand', 'Amritsar, Punjab', 'Navi Mumbai, Maharashtra',
        'Allahabad, Uttar Pradesh', 'Howrah, West Bengal', 'Gwalior, Madhya Pradesh', 'Jabalpur, Madhya Pradesh',
        'Coimbatore, Tamil Nadu', 'Vijayawada, Andhra Pradesh', 'Jodhpur, Rajasthan', 'Madurai, Tamil Nadu',
        'Raipur, Chhattisgarh', 'Kota, Rajasthan', 'Guwahati, Assam', 'Chandigarh, Chandigarh', 'Solapur, Maharashtra'
    ];
    const [citySuggestions, setCitySuggestions] = useState<string[]>([]);

    // Sports State
    const [playSports, setPlaySports] = useState<string[]>([]);
    const [likeSports, setLikeSports] = useState<string[]>([]);

    // Derived state
    const uniqueSports = new Set([...playSports, ...likeSports]);
    const totalSelected = uniqueSports.size;

    // Photos state
    const [photos, setPhotos] = useState<string[]>([]);

    const handleNextStep1 = () => {
        if (profile.name && profile.age && profile.gender && profile.location && profile.mobile) {
            setStep(2);
        } else {
            alert("Please fill in all mandatory details.");
        }
    };

    const handleNextStep2 = () => {
        if (totalSelected > 0) {
            setStep(3);
        } else {
            alert("Please select at least one sport.");
        }
    };

    const handleNextStep3 = () => {
        if (preferences.genderPreference && preferences.datingRange) {
            setStep(4);
        } else {
            alert("Please fill in your preferences.");
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            filesArray.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (typeof reader.result === 'string') {
                        setPhotos(prev => {
                            if (prev.length < 6) {
                                return [...prev, reader.result as string];
                            }
                            return prev;
                        });
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removePhoto = (indexToRemove: number) => {
        setPhotos(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setProfile({ ...profile, location: val });
        if (val.length > 0) {
            setCitySuggestions(CITIES.filter(c => c.toLowerCase().includes(val.toLowerCase())));
        } else {
            setCitySuggestions([]);
        }
    };

    const fetchDeviceLocation = () => {
        // Mock geolocation fetch
        setProfile({ ...profile, location: 'Bangalore' });
        setCitySuggestions([]);
    };

    const toggleSport = (sportId: string, listType: 'play' | 'like') => {
        const isPlaying = playSports.includes(sportId);
        const isLiking = likeSports.includes(sportId);

        if (listType === 'play') {
            if (isPlaying) {
                // Remove from play
                setPlaySports(prev => prev.filter(id => id !== sportId));
                // We leave it in "like" in case they still like it, or we could remove it. Standard is usually to leave it.
            } else {
                // Add to play
                if (totalSelected >= 5 && !isLiking) return; // Prevent if max reached and it's a new unique sport
                setPlaySports(prev => [...prev, sportId]);
                // Auto-copy to like
                if (!isLiking) {
                    setLikeSports(prev => [...prev, sportId]);
                }
            }
        } else {
            if (isLiking) {
                // Remove from like
                setLikeSports(prev => prev.filter(id => id !== sportId));
                // If they remove from Like, logically they shouldn't "Play" it either if Play implies Like.
                if (isPlaying) {
                    setPlaySports(prev => prev.filter(id => id !== sportId));
                }
            } else {
                // Add to like
                if (totalSelected >= 5 && !isPlaying) return;
                setLikeSports(prev => [...prev, sportId]);
            }
        }
    };

    const handleFinish = () => {
        if (photos.length === 0) {
            alert("Please upload at least one profile photo.");
            return;
        }

        const userData = {
            id: Date.now().toString(),
            email: localStorage.getItem('tempEmail') || '',
            ...profile,
            sports: Array.from(uniqueSports),
            playSports,
            likeSports,
            preferences,
            photos
        };

        fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        })
            .then(() => {
                navigate('/home');
            })
            .catch(err => {
                console.error("Failed to save profile", err);
                // Navigate anyway for demo purposes if DB fails
                navigate('/home');
            });
    };

    return (
        <div style={{ padding: '2rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-color)', minHeight: '100vh', boxSizing: 'border-box' }}>

            {/* Header / Back Button */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                {step > 1 && (
                    <button onClick={() => setStep(step - 1)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginRight: '1rem', display: 'flex' }}>
                        <ArrowLeft size={24} color="var(--secondary)" />
                    </button>
                )}
                {/* Progress Bar */}
                <div style={{ flex: 1, height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', marginRight: '1rem' }}>
                    <div style={{ width: step === 1 ? '25%' : step === 2 ? '50%' : step === 3 ? '75%' : '100%', height: '100%', backgroundColor: 'var(--secondary)', borderRadius: '2px', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>{step}/4</span>
            </div>

            {step === 1 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="fade-in">
                    <h1 className="h1">Welcome to Deuce!</h1>
                    <p className="text-muted" style={{ marginBottom: '2rem' }}>Let's build your active profile.</p>

                    <div style={{ flex: 1 }}>
                        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <input
                                type="text"
                                placeholder="Name"
                                value={profile.name}
                                readOnly
                                style={{ backgroundColor: '#f3f4f6', color: 'var(--text-muted)', marginBottom: 0 }}
                            />
                            <input
                                type="number"
                                placeholder="Age"
                                value={profile.age}
                                onChange={e => setProfile({ ...profile, age: e.target.value })}
                                style={{ marginBottom: 0 }}
                            />
                            <select
                                value={profile.gender}
                                onChange={e => setProfile({ ...profile, gender: e.target.value })}
                                style={{ marginBottom: 0 }}
                            >
                                <option value="" disabled>Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Non-binary">Non-binary</option>
                            </select>

                            <div style={{ position: 'relative' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Location (City)"
                                        value={profile.location}
                                        onChange={handleLocationChange}
                                        style={{ marginBottom: 0, flex: 1 }}
                                    />
                                    <button
                                        onClick={fetchDeviceLocation}
                                        title="Use my location"
                                        style={{ background: 'var(--primary)', border: 'none', borderRadius: '12px', padding: '0 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={20} color="var(--secondary)" />
                                    </button>
                                </div>
                                {citySuggestions.length > 0 && (
                                    <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 0, margin: '4px 0 0 0', listStyle: 'none', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', maxHeight: '150px', overflowY: 'auto' }}>
                                        {citySuggestions.map(city => (
                                            <li key={city} onClick={() => { setProfile({ ...profile, location: city }); setCitySuggestions([]); }} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>{city}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <input
                                type="tel"
                                placeholder="+91 9876543210"
                                value={profile.mobile}
                                onChange={e => setProfile({ ...profile, mobile: e.target.value })}
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                    </div>

                    <Button fullWidth variant="outline" onClick={handleNextStep1} style={{ marginTop: '2rem', borderColor: 'var(--secondary)', borderWidth: '2px' }}>
                        Next
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="fade-in">
                    <h1 className="h2" style={{ textAlign: 'center' }}>Tell us about your sport life!</h1>
                    <p className="text-muted" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        Select up to 5 unique sports.
                    </p>

                    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '1rem' }}>

                        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Sports I Play</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {AVAILABLE_SPORTS.map(sport => {
                                const isSelected = playSports.includes(sport.id);
                                return (
                                    <button
                                        key={`play-${sport.id}`}
                                        onClick={() => toggleSport(sport.id, 'play')}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '1rem 0.5rem',
                                            borderRadius: '16px',
                                            border: isSelected ? '2px solid var(--primary)' : '1px solid #e5e7eb',
                                            backgroundColor: isSelected ? '#f7fee7' : '#fff', // light green tint if selected
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{sport.icon}</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: isSelected ? 700 : 500 }}>{sport.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Sports I Like (Watch/Follow)</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            {AVAILABLE_SPORTS.map(sport => {
                                const isSelected = likeSports.includes(sport.id);
                                const isPlayed = playSports.includes(sport.id);
                                return (
                                    <button
                                        key={`like-${sport.id}`}
                                        onClick={() => toggleSport(sport.id, 'like')}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '1rem 0.5rem',
                                            borderRadius: '16px',
                                            border: isSelected ? '2px solid var(--secondary)' : '1px solid #e5e7eb',
                                            backgroundColor: isSelected ? '#f3f4f6' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            opacity: isPlayed ? 0.7 : 1 // Visually indicate it's forced by "play"
                                        }}
                                    >
                                        <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{sport.icon}</span>
                                        <span style={{ fontSize: '0.75rem', fontWeight: isSelected ? 700 : 500 }}>{sport.label}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
                            <p style={{ fontWeight: 600, color: totalSelected === 5 ? 'var(--error)' : 'var(--text-main)' }}>
                                {totalSelected}/5 unique sports selected
                            </p>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.5rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{playSports.length}</span>
                                    <p className="text-muted" style={{ margin: 0 }}>play</p>
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{likeSports.length}</span>
                                    <p className="text-muted" style={{ margin: 0 }}>like</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    <Button fullWidth onClick={handleNextStep2} disabled={totalSelected === 0}>
                        Next
                    </Button>
                </div>
            )}

            {step === 3 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="fade-in">
                    <h1 className="h2" style={{ textAlign: 'center' }}>Who are you looking for?</h1>
                    <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        Set your dating preferences.
                    </p>

                    <div style={{ flex: 1 }}>
                        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Gender Preference</label>
                            <select
                                value={preferences.genderPreference}
                                onChange={e => setPreferences({ ...preferences, genderPreference: e.target.value })}
                                style={{ marginBottom: 0 }}
                            >
                                <option value="" disabled>Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Everyone">Everyone</option>
                            </select>

                            <label style={{ fontWeight: 600, fontSize: '0.9rem', marginTop: '1rem' }}>Dating Range</label>
                            <select
                                value={preferences.datingRange}
                                onChange={e => setPreferences({ ...preferences, datingRange: e.target.value })}
                                style={{ marginBottom: 0 }}
                            >
                                <option value="" disabled>Select range</option>
                                <option value="50km">Within 50 KM</option>
                                <option value="city">My City Only</option>
                                <option value="india">All Over India</option>
                                <option value="world">World</option>
                            </select>
                        </div>
                    </div>

                    <Button fullWidth onClick={handleNextStep3} disabled={!preferences.genderPreference || !preferences.datingRange}>
                        Next
                    </Button>
                </div>
            )}

            {step === 4 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="fade-in">
                    <h1 className="h2" style={{ textAlign: 'center' }}>Add your best photos</h1>
                    <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        Upload up to 6 photos to show your active lifestyle.
                    </p>

                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                            {[...Array(6)].map((_, index) => (
                                <div key={index} style={{
                                    aspectRatio: '3/4',
                                    backgroundColor: '#f3f4f6',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    border: '2px dashed #d1d5db',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {photos[index] ? (
                                        <>
                                            <img src={photos[index]} alt={`Upload ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button
                                                onClick={() => removePhoto(index)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    background: 'rgba(0,0,0,0.5)',
                                                    border: 'none',
                                                    borderRadius: '50%',
                                                    width: '24px',
                                                    height: '24px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    color: 'white'
                                                }}
                                            >
                                                <CloseIcon size={14} />
                                            </button>
                                        </>
                                    ) : (
                                        <label style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} style={{ display: 'none' }} />
                                            <Plus size={24} color="#9ca3af" />
                                        </label>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                            You can select multiple photos at once. Click the + icon.
                        </p>
                    </div>

                    <Button fullWidth onClick={handleFinish} disabled={photos.length === 0}>
                        Let's Play
                    </Button>
                </div>
            )}

        </div>
    );
}
