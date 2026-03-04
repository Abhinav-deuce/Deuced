import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const top100Cities = [
    { name: 'Mumbai', state: 'Maharashtra' },
    { name: 'Delhi', state: 'Delhi' },
    { name: 'Bangalore', state: 'Karnataka' },
    { name: 'Hyderabad', state: 'Telangana' },
    { name: 'Ahmedabad', state: 'Gujarat' },
    { name: 'Chennai', state: 'Tamil Nadu' },
    { name: 'Kolkata', state: 'West Bengal' },
    { name: 'Surat', state: 'Gujarat' },
    { name: 'Pune', state: 'Maharashtra' },
    { name: 'Jaipur', state: 'Rajasthan' },
    { name: 'Lucknow', state: 'Uttar Pradesh' },
    { name: 'Kanpur', state: 'Uttar Pradesh' },
    { name: 'Nagpur', state: 'Maharashtra' },
    { name: 'Indore', state: 'Madhya Pradesh' },
    { name: 'Thane', state: 'Maharashtra' },
    { name: 'Bhopal', state: 'Madhya Pradesh' },
    { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
    { name: 'Pimpri-Chinchwad', state: 'Maharashtra' },
    { name: 'Patna', state: 'Bihar' },
    { name: 'Vadodara', state: 'Gujarat' },
    { name: 'Ghaziabad', state: 'Uttar Pradesh' },
    { name: 'Ludhiana', state: 'Punjab' },
    { name: 'Agra', state: 'Uttar Pradesh' },
    { name: 'Nashik', state: 'Maharashtra' },
    { name: 'Ranchi', state: 'Jharkhand' },
    { name: 'Faridabad', state: 'Haryana' },
    { name: 'Meerut', state: 'Uttar Pradesh' },
    { name: 'Rajkot', state: 'Gujarat' },
    { name: 'Kalyan-Dombivli', state: 'Maharashtra' },
    { name: 'Vasai-Virar', state: 'Maharashtra' },
    { name: 'Varanasi', state: 'Uttar Pradesh' },
    { name: 'Srinagar', state: 'Jammu & Kashmir' },
    { name: 'Aurangabad', state: 'Maharashtra' },
    { name: 'Dhanbad', state: 'Jharkhand' },
    { name: 'Amritsar', state: 'Punjab' },
    { name: 'Navi Mumbai', state: 'Maharashtra' },
    { name: 'Allahabad', state: 'Uttar Pradesh' },
    { name: 'Howrah', state: 'West Bengal' },
    { name: 'Gwalior', state: 'Madhya Pradesh' },
    { name: 'Jabalpur', state: 'Madhya Pradesh' },
    { name: 'Coimbatore', state: 'Tamil Nadu' },
    { name: 'Vijayawada', state: 'Andhra Pradesh' },
    { name: 'Jodhpur', state: 'Rajasthan' },
    { name: 'Madurai', state: 'Tamil Nadu' },
    { name: 'Raipur', state: 'Chhattisgarh' },
    { name: 'Chandigarh', state: 'Chandigarh' },
    { name: 'Guntur', state: 'Andhra Pradesh' },
    { name: 'Guwahati', state: 'Assam' },
    { name: 'Solapur', state: 'Maharashtra' },
    { name: 'Hubli-Dharwad', state: 'Karnataka' },
    { name: 'Mysore', state: 'Karnataka' },
    { name: 'Tiruchirappalli', state: 'Tamil Nadu' },
    { name: 'Bareilly', state: 'Uttar Pradesh' },
    { name: 'Aligarh', state: 'Uttar Pradesh' },
    { name: 'Tiruppur', state: 'Tamil Nadu' },
    { name: 'Gurugram', state: 'Haryana' },
    { name: 'Moradabad', state: 'Uttar Pradesh' },
    { name: 'Jalandhar', state: 'Punjab' },
    { name: 'Bhubaneswar', state: 'Odisha' },
    { name: 'Salem', state: 'Tamil Nadu' },
    { name: 'Warangal', state: 'Telangana' },
    { name: 'Mira-Bhayandar', state: 'Maharashtra' },
    { name: 'Jalgaon', state: 'Maharashtra' },
    { name: 'Kota', state: 'Rajasthan' },
    { name: 'Thiruvananthapuram', state: 'Kerala' },
    { name: 'Bhiwandi', state: 'Maharashtra' },
    { name: 'Saharanpur', state: 'Uttar Pradesh' },
    { name: 'Gorakhpur', state: 'Uttar Pradesh' },
    { name: 'Bikaner', state: 'Rajasthan' },
    { name: 'Amravati', state: 'Maharashtra' },
    { name: 'Noida', state: 'Uttar Pradesh' },
    { name: 'Jamshedpur', state: 'Jharkhand' },
    { name: 'Bhilai', state: 'Chhattisgarh' },
    { name: 'Cuttack', state: 'Odisha' },
    { name: 'Firozabad', state: 'Uttar Pradesh' },
    { name: 'Kochi', state: 'Kerala' },
    { name: 'Nellore', state: 'Andhra Pradesh' },
    { name: 'Bhavnagar', state: 'Gujarat' },
    { name: 'Dehradun', state: 'Uttarakhand' },
    { name: 'Durgapur', state: 'West Bengal' },
    { name: 'Asansol', state: 'West Bengal' },
    { name: 'Rourkela', state: 'Odisha' },
    { name: 'Nanded', state: 'Maharashtra' },
    { name: 'Kolhapur', state: 'Maharashtra' },
    { name: 'Ajmer', state: 'Rajasthan' },
    { name: 'Akola', state: 'Maharashtra' },
    { name: 'Gulbarga', state: 'Karnataka' },
    { name: 'Jamnagar', state: 'Gujarat' },
    { name: 'Ujjain', state: 'Madhya Pradesh' },
    { name: 'Loni', state: 'Uttar Pradesh' },
    { name: 'Siliguri', state: 'West Bengal' },
    { name: 'Jhansi', state: 'Uttar Pradesh' },
    { name: 'Ulhasnagar', state: 'Maharashtra' },
    { name: 'Jammu', state: 'Jammu & Kashmir' },
    { name: 'Sangli-Miraj & Kupwad', state: 'Maharashtra' },
    { name: 'Mangalore', state: 'Karnataka' },
    { name: 'Erode', state: 'Tamil Nadu' },
    { name: 'Belgaum', state: 'Karnataka' },
    { name: 'Ambattur', state: 'Tamil Nadu' },
    { name: 'Tirunelveli', state: 'Tamil Nadu' },
    { name: 'Malegaon', state: 'Maharashtra' },
    { name: 'Gaya', state: 'Bihar' }
];

async function main() {
    console.log('Seeding cities...');
    // Delete existing to avoid duplicates
    await prisma.city.deleteMany({});

    for (const city of top100Cities) {
        await prisma.city.create({
            data: city,
        });
    }
    console.log('Successfully seeded 100 cities!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
