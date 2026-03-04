import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
    errorFormat: 'minimal',
});
const app = express();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));

// --- Auth (Google) ---
app.post('/api/auth/google', async (req, res) => {
    const { token } = req.body;
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;

        // Check if user exists by email
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Return temporary user info so frontend knows they are new
            return res.json({ isNew: true, user: { email, name } });
        }

        // User exists.
        return res.json({ isNew: false, user });
    } catch (error) {
        console.error("Token verification failed", error);
        res.status(401).json({ error: "Invalid token" });
    }
});

// --- Users (Onboarding) ---
app.post('/users', async (req, res) => {
    try {
        const { email, name, age, gender, location, mobile, preferences, sports, playSports, likeSports, photos, bio } = req.body;

        const newUser = await prisma.user.create({
            data: {
                email: email || undefined,
                name: name || '',
                age: age || '',
                gender: gender || '',
                location: location || '',
                mobile: mobile || '',
                genderPreference: preferences?.genderPreference || '',
                datingRange: preferences?.datingRange || '',
                bio: bio || '',
                sports: JSON.stringify(sports || []),
                playSports: JSON.stringify(playSports || []),
                likeSports: JSON.stringify(likeSports || []),
                photos: JSON.stringify(photos || [])
            }
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

// --- Discover Profiles ---
app.get('/profiles', async (req, res) => {
    // Return some dummy profiles if DB is empty for demo purposes
    const profiles = await prisma.discoverProfile.findMany();
    if (profiles.length === 0) {
        return res.json([
            { id: "1", name: "Sarah", age: 24, distance: "2 miles away", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", sports: ["Tennis", "Running"] },
            { id: "2", name: "Michael", age: 27, distance: "5 miles away", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", sports: ["Basketball", "Gym"] },
            { id: "3", name: "Emma", age: 22, distance: "1 mile away", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", sports: ["Yoga", "Tennis"] }
        ]);
    }

    // Parse sports JSON back to array before sending
    const parsedProfiles = profiles.map(p => ({
        ...p,
        sports: JSON.parse(p.sports)
    }));
    res.json(parsedProfiles);
});

// --- Interested List ---
app.get('/interested', async (req, res) => {
    const interested = await prisma.interestedUser.findMany();
    if (interested.length === 0) {
        return res.json([
            { id: "1", name: "Alex", age: 26, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", sports: ["Tennis"] },
            { id: "2", name: "Jessica", age: 23, image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", sports: ["Yoga"] }
        ]);
    }
    res.json(interested.map(i => ({ ...i, sports: i.sports ? JSON.parse(i.sports) : [] })));
});

// --- Notifications ---
app.get('/notifications', async (req, res) => {
    const notifications = await prisma.notification.findMany();
    if (notifications.length === 0) {
        return res.json([
            { id: "1", title: "New Match!", message: "You and Sarah liked each other.", time: "2m ago", unread: true, type: "match", link: "/chat/1" },
            { id: "2", title: "New Message", message: "Michael: Hey, want to hit the gym?", time: "1h ago", unread: true, type: "message", link: "/chat/2" }
        ]);
    }
    res.json(notifications);
});

// --- Chat Matches ---
app.get('/matches', async (req, res) => {
    const matches = await prisma.match.findMany();
    if (matches.length === 0) {
        return res.json([
            { id: "1", name: "Sarah", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", lastMessage: "Sounds great! See you then.", time: "10:30 AM", unreadCount: 2, isOnline: true },
            { id: "2", name: "Michael", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", lastMessage: "Are we still on for tennis?", time: "Yesterday", unreadCount: 0, isOnline: false }
        ]);
    }
    res.json(matches);
});

// --- Messages ---
app.get('/messages', async (req, res) => {
    const { chatId } = req.query;
    const filter = chatId ? { where: { chatId: String(chatId) } } : {};
    const messages = await prisma.message.findMany(filter);

    if (messages.length === 0 && chatId) {
        return res.json([
            { id: "1", chatId: String(chatId), sender: "them", text: "Hey! Ready for the match?", date: new Date().toISOString(), read: true, systemAlert: false }
        ])
    }
    res.json(messages);
});

// --- Cities ---
app.get('/cities', async (req, res) => {
    try {
        const cities = await prisma.city.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(cities);
    } catch (error) {
        console.error("Error fetching cities:", error);
        res.status(500).json({ error: "Failed to fetch cities" });
    }
});

app.post('/messages', async (req, res) => {
    const { chatId, sender, text, date, read, systemAlert } = req.body;

    try {
        const newMsg = await prisma.message.create({
            data: {
                chatId: String(chatId),
                sender: sender || 'me',
                text: text || '',
                date: date || new Date().toISOString(),
                read: read || false,
                systemAlert: systemAlert || false
            }
        });
        res.status(201).json(newMsg);
    } catch (error) {
        console.error("Error saving message", error);
        res.status(500).json({ error: "Failed to save message" });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Express server running with Prisma on port ${PORT}`);
});
