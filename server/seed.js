import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDatabase from './config/db.js';
import AdoptionRequest from './models/AdoptionRequest.js';
import Pet from './models/Pet.js';
import User from './models/User.js';

dotenv.config();

const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;
const pet = (name, species, breed, age, gender, location, photo, status, personality, description) => ({
  name, species, breed, age, gender, location, image: image(photo), status, personality, description, vaccinated: true,
});

const pets = [
  pet('Buddy', 'Dog', 'Golden Retriever', 2, 'Male', 'Lucknow', 'photo-1552053831-71594a27632d', 'Available', ['Friendly', 'Playful', 'Gentle'], 'Buddy is an affectionate Golden Retriever who loves morning walks, children, and a good game of fetch.'),
  pet('Luna', 'Cat', 'Persian', 1, 'Female', 'Delhi', 'photo-1513360371669-4adf3dd7dff8', 'Available', ['Calm', 'Loving', 'Quiet'], 'Luna is a graceful indoor cat who enjoys sunny windows, soft blankets, and gentle attention.'),
  pet('Rocky', 'Dog', 'Labrador Retriever', 3, 'Male', 'Mumbai', 'photo-1587300003388-59208cc962cb', 'Available', ['Energetic', 'Loyal', 'Smart'], 'Rocky is a bright and energetic Labrador looking for an active family that enjoys outdoor adventures.'),
  pet('Milo', 'Cat', 'Indian Shorthair', 2, 'Male', 'Pune', 'photo-1573865526739-10659fec78a5', 'Available', ['Curious', 'Gentle', 'Independent'], 'Milo is a curious rescue cat with a gentle nature and a fondness for toy mice.'),
  pet('Bella', 'Dog', 'Beagle', 4, 'Female', 'Bengaluru', 'photo-1505628346881-b72b27e84530', 'Pending', ['Cheerful', 'Social', 'Food-motivated'], 'Bella is a cheerful Beagle whose wagging tail and friendly personality brighten every room.'),
  pet('Coco', 'Rabbit', 'Holland Lop', 1, 'Female', 'Jaipur', 'photo-1585110396000-c9ffd4e4b308', 'Available', ['Gentle', 'Shy', 'Sweet'], 'Coco is a soft, quiet rabbit who needs a patient home with a safe indoor enclosure.'),
  pet('Max', 'Dog', 'Indian Pariah', 2, 'Male', 'Hyderabad', 'photo-1558788353-f76d92427f16', 'Available', ['Loyal', 'Alert', 'Affectionate'], 'Max is an intelligent local rescue dog who bonds deeply with his people.'),
  pet('Simba', 'Cat', 'Maine Coon Mix', 3, 'Male', 'Chennai', 'photo-1495360010541-f48722b34f7d', 'Available', ['Confident', 'Gentle', 'Playful'], 'Simba is a magnificent, people-friendly cat who enjoys company and feather toys.'),
  pet('Daisy', 'Dog', 'Pug', 5, 'Female', 'Kolkata', 'photo-1583511655857-d19b40a7a54e', 'Adopted', ['Relaxed', 'Funny', 'Affectionate'], 'Daisy has found her loving home and remains part of our success-story family.'),
  pet('Oreo', 'Rabbit', 'Dutch Rabbit', 2, 'Male', 'Ahmedabad', 'photo-1535241749838-299277b6305f', 'Available', ['Curious', 'Gentle', 'Active'], 'Oreo is a lively black-and-white rabbit who enjoys tunnels, hay, and quiet companionship.'),
  pet('Charlie', 'Dog', 'Cocker Spaniel', 1, 'Male', 'Noida', 'photo-1561037404-61cd46aa615b', 'Available', ['Happy', 'Trainable', 'Loving'], 'Charlie is a young, eager-to-learn companion who will thrive with basic training and affection.'),
  pet('Nala', 'Cat', 'Siamese', 4, 'Female', 'Gurugram', 'photo-1518791841217-8f162f1e1131', 'Available', ['Elegant', 'Vocal', 'Affectionate'], 'Nala is a social Siamese cat who enjoys conversation and a calm indoor routine.'),
  pet('Bruno', 'Dog', 'German Shepherd', 4, 'Male', 'Delhi', 'photo-1589941013453-ec89f33b5e95', 'Pending', ['Protective', 'Intelligent', 'Loyal'], 'Bruno is a well-mannered German Shepherd suited to an experienced, caring dog owner.'),
  pet('Snowy', 'Rabbit', 'Lionhead', 1, 'Female', 'Pune', 'photo-1609151354448-c4a53450c3e9', 'Available', ['Soft', 'Gentle', 'Playful'], 'Snowy is a fluffy Lionhead rabbit with a curious personality and a love for fresh greens.'),
  pet('Leo', 'Cat', 'Indian Shorthair', 3, 'Male', 'Mumbai', 'photo-1592194996308-7b43878e84a6', 'Available', ['Calm', 'Observant', 'Friendly'], 'Leo is a relaxed companion who gets along well with patient people and peaceful homes.'),
  pet('Tara', 'Dog', 'Indie Mix', 2, 'Female', 'Bengaluru', 'photo-1537151608828-ea2b11777ee8', 'Available', ['Brave', 'Loving', 'Active'], 'Tara is a resilient rescue dog with a huge heart and plenty of energy for walks.'),
  pet('Ginger', 'Cat', 'Orange Tabby', 2, 'Female', 'Kochi', 'photo-1574158622682-e40e69881006', 'Available', ['Friendly', 'Mischievous', 'Warm'], 'Ginger is a bright, sociable tabby who loves people and playful afternoons.'),
  pet('Toby', 'Dog', 'Dachshund', 6, 'Male', 'Chandigarh', 'photo-1543466835-00a7907e9de1', 'Adopted', ['Brave', 'Loving', 'Gentle'], 'Toby has been adopted into a warm home after waiting patiently for his perfect match.'),
];

const seedDatabase = async () => {
  await connectDatabase();
  const hashedPassword = await bcrypt.hash('Demo@123', 10);

  await AdoptionRequest.deleteMany();
  await Pet.deleteMany();
  await User.deleteMany();

  await User.insertMany([
    { name: 'PawConnect Admin', email: 'admin@pawconnect.demo', password: hashedPassword, phone: '9876543210', role: 'admin', address: 'PawConnect Shelter, Lucknow' },
    { name: 'Aarav Sharma', email: 'user@pawconnect.demo', password: hashedPassword, phone: '9876501234', role: 'user', address: 'Gomti Nagar, Lucknow' },
  ]);
  await Pet.insertMany(pets);
  console.log(`Seeded 2 demo users and ${pets.length} pets.`);
  console.log('Admin: admin@pawconnect.demo / Demo@123');
  console.log('User: user@pawconnect.demo / Demo@123');
  await mongoose.disconnect();
};

seedDatabase().catch(async (error) => {
  console.error(`Seeding failed: ${error.message}`);
  await mongoose.disconnect();
  process.exit(1);
});
