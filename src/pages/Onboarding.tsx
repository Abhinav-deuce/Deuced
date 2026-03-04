import { useState, useEffect } from 'react';
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
        name: localStorage.getItem('tempName') || '',
        age: '',
        gender: '',
        location: '',
        mobile: '',
        bio: ''
    });

    const [preferences, setPreferences] = useState({
        genderPreference: '',
        datingRange: ''
    });

    // Cities from DB
    const [dbCities, setDbCities] = useState<{ id: string, name: string, state: string }[]>([]);
    const [citySuggestions, setCitySuggestions] = useState<{ id: string, name: string, state: string }[]>([]);

    useEffect(() => {
        fetch('http://localhost:3001/cities')
            .then(res => res.json())
            .then(data => setDbCities(data))
            .catch(err => console.error("Failed to fetch cities", err));
    }, []);

    // Sports State
    const [playSports, setPlaySports] = useState<string[]>([]);
    const [likeSports, setLikeSports] = useState<string[]>([]);

    // Derived state
    const uniqueSports = new Set([...playSports, ...likeSports]);
    const totalSelected = uniqueSports.size;

    // Photos state
    const [photos, setPhotos] = useState<string[]>([]);

    // Validation states
    const [mobileError, setMobileError] = useState('');
    const [nameError, setNameError] = useState('');
    const [ageError, setAgeError] = useState('');

    const handleNextStep1 = () => {
        setMobileError('');
        setNameError('');
        setAgeError('');

        if (!profile.name || !profile.age || !profile.gender || !profile.location || !profile.mobile) {
            alert("Please fill in all mandatory details.");
            return;
        }

        // Age Validation: Must be at least 18
        const ageNum = parseInt(profile.age, 10);
        if (isNaN(ageNum) || ageNum < 18) {
            setAgeError('You must be at least 18 years old to use Deuce.');
            return;
        }

        // Name Validation: Only letters and spaces
        const nameRegex = /^[A-Za-z\s]+$/;
        if (!nameRegex.test(profile.name.trim())) {
            setNameError('Name should only contain letters and spaces.');
            return;
        }

        // Mobile Validation: Exactly 10 digits, starts with 6-9
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(profile.mobile)) {
            setMobileError('Please enter a valid 10-digit Indian mobile number.');
            return;
        }

        // Mobile Validation: Reject 10 identical digits (e.g. 9999999999, 8888888888)
        const allSameDigitsRegex = /^(\d)\1{9}$/;
        if (allSameDigitsRegex.test(profile.mobile)) {
            setMobileError('Invalid mobile sequence (repeating digits).');
            return;
        }

        setStep(2);
    };

    const handleNextStep2 = () => {
        if (profile.bio.trim()) {
            setStep(3);
        } else {
            alert("Please write a short bio about yourself.");
        }
    };

    const handleNextStep3 = () => {
        if (totalSelected > 0) {
            setStep(4);
        } else {
            alert("Please select at least one sport.");
        }
    };

    const handleNextStep4 = () => {
        if (preferences.genderPreference && preferences.datingRange) {
            setStep(5);
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
            const matches = dbCities.filter(c =>
                c.name.toLowerCase().includes(val.toLowerCase()) ||
                c.state.toLowerCase().includes(val.toLowerCase())
            );
            setCitySuggestions(matches);
        } else {
            setCitySuggestions([]);
        }
    };

    const fetchDeviceLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            try {
                // Using OpenStreetMap Nominatim for free reverse geocoding
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`);
                const data = await res.json();

                // Extract city or county/district name
                let detectedCity = data.address.city || data.address.state_district || data.address.county || '';

                // Clean up trailing " District" if present
                detectedCity = detectedCity.replace(' District', '');

                if (detectedCity) {
                    // Try to map to state if we can, else just use the city
                    const state = data.address.state || '';
                    setProfile({ ...profile, location: `${detectedCity}${state ? `, ${state}` : ''}` });
                } else {
                    alert("Could not determine your city from location data.");
                }
            } catch (error) {
                console.error("Geocoding failed", error);
                alert("Failed to fetch location address.");
            }
            setCitySuggestions([]);
        }, () => {
            alert("Unable to retrieve your location. Please check your permissions.");
        });
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
                    <div style={{ width: step === 1 ? '20%' : step === 2 ? '40%' : step === 3 ? '60%' : step === 4 ? '80%' : '100%', height: '100%', backgroundColor: 'var(--secondary)', borderRadius: '2px', transition: 'width 0.3s' }} />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>{step}/5</span>
            </div>

            {step === 1 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="fade-in">
                    <h1 className="h1">Welcome to Deuce!</h1>
                    <p className="text-muted" style={{ marginBottom: '2rem' }}>Let's build your active profile.</p>

                    <div style={{ flex: 1 }}>
                        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={profile.name}
                                    onChange={e => {
                                        // Optional: block numbers as they type
                                        const val = e.target.value;
                                        if (/^[A-Za-z\s]*$/.test(val)) {
                                            setProfile({ ...profile, name: val });
                                        }
                                    }}
                                    style={{ marginBottom: nameError ? '0.25rem' : 0, borderColor: nameError ? 'red' : undefined }}
                                    required
                                />
                                {nameError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{nameError}</span>}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <input
                                    type="number"
                                    placeholder="Age"
                                    value={profile.age}
                                    onChange={e => {
                                        const val = e.target.value;
                                        // Enforce max 2 digits
                                        if (val.length <= 2) {
                                            setProfile({ ...profile, age: val });
                                        }
                                    }}
                                    style={{ marginBottom: ageError ? '0.25rem' : 0, borderColor: ageError ? 'red' : undefined }}
                                    required
                                    min="18"
                                    max="99"
                                />
                                {ageError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{ageError}</span>}
                            </div>
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
                                        style={{ background: '#e23d3f', border: 'none', borderRadius: '12px', padding: '0 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <MapPin size={20} color="white" />
                                    </button>
                                </div>
                                {citySuggestions.length > 0 && (
                                    <ul style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e5e7eb', borderRadius: '8px', padding: 0, margin: '4px 0 0 0', listStyle: 'none', zIndex: 10, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', maxHeight: '150px', overflowY: 'auto' }}>
                                        {citySuggestions.map(cityObj => (
                                            <li key={cityObj.id} onClick={() => { setProfile({ ...profile, location: `${cityObj.name}, ${cityObj.state}` }); setCitySuggestions([]); }} style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }}>
                                                {cityObj.name}, <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cityObj.state}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <input
                                    type="tel"
                                    placeholder="Mobile (+91 9876543210)"
                                    value={profile.mobile}
                                    onChange={e => {
                                        const val = e.target.value.replace(/\D/g, ''); // Strip non-digits automatically
                                        if (val.length <= 10) {
                                            setProfile({ ...profile, mobile: val });
                                        }
                                    }}
                                    style={{ marginBottom: mobileError ? '0.25rem' : 0, borderColor: mobileError ? 'red' : undefined }}
                                    required
                                    maxLength={10}
                                />
                                {mobileError && <span style={{ color: 'red', fontSize: '0.8rem' }}>{mobileError}</span>}
                            </div>
                        </div>
                    </div>

                    <Button fullWidth variant="primary" onClick={handleNextStep1} style={{ marginTop: '2rem' }}>
                        Next
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="fade-in">
                    <h1 className="h2" style={{ textAlign: 'center' }}>In your own words</h1>
                    <p className="text-muted" style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        Write a short bio to stand out.
                    </p>

                    <div style={{ flex: 1 }}>
                        <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <textarea
                                placeholder="I love hitting the courts on weekends and trying out new cafes. Let's play a match!"
                                value={profile.bio}
                                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                                style={{
                                    width: '100%',
                                    minHeight: '150px',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '1rem',
                                    resize: 'none',
                                    fontFamily: 'inherit',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>
                    </div>

                    <Button fullWidth onClick={handleNextStep2} disabled={!profile.bio.trim()}>
                        Next
                    </Button>
                </div>
            )}

            {step === 3 && (
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
                                            border: isSelected ? '2px solid #e23d3f' : '1px solid #e5e7eb',
                                            backgroundColor: isSelected ? '#fdf2f2' : '#fff', // Soft red tint if selected
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

                    <Button fullWidth onClick={handleNextStep3} disabled={totalSelected === 0}>
                        Next
                    </Button>
                </div>
            )}

            {step === 4 && (
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

                    <Button fullWidth onClick={handleNextStep4} disabled={!preferences.genderPreference || !preferences.datingRange}>
                        Next
                    </Button>
                </div>
            )}

            {step === 5 && (
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
