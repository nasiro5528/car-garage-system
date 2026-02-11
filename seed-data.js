require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Garage = require('./src/models/Garage');
const Car = require('./src/models/Car');
const Service = require('./src/models/Service');

async function seedData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        // Clear existing data
        await User.deleteMany({});
        await Garage.deleteMany({});
        await Car.deleteMany({});
        await Service.deleteMany({});
        
        // Create Admin
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@car-garaging.com',
            password: 'admin123',
            role: 'admin',
            phone: '+251911223344'
        });
        
        // Create Garage Owners
        const garageOwner1 = await User.create({
            name: 'John Garage Owner',
            email: 'john@garage.com',
            password: 'password123',
            role: 'garage_owner',
            phone: '+251911334455'
        });
        
        const garageOwner2 = await User.create({
            name: 'Sarah Garage Owner',
            email: 'sarah@garage.com',
            password: 'password123',
            role: 'garage_owner',
            phone: '+251911445566'
        });
        
        // Create Car Owners
        const carOwner1 = await User.create({
            name: 'Mike Car Owner',
            email: 'mike@example.com',
            password: 'password123',
            role: 'car_owner',
            phone: '+251911556677'
        });
        
        const carOwner2 = await User.create({
            name: 'Lucy Car Owner',
            email: 'lucy@example.com',
            password: 'password123',
            role: 'car_owner',
            phone: '+251911667788'
        });
        
        // Create Services
        const services = await Service.create([
            { name: 'Oil Change', description: 'Engine oil change service', price: 1500 },
            { name: 'Brake Repair', description: 'Brake pad replacement', price: 3000 },
            { name: 'Tire Rotation', description: 'Tire rotation and balancing', price: 800 },
            { name: 'Car Wash', description: 'Full car wash service', price: 500 },
            { name: 'Engine Tune-up', description: 'Complete engine checkup', price: 2500 }
        ]);
        
        // Create Garages
        const garage1 = await Garage.create({
            name: 'City Auto Repair Center',
            address: 'Bole Road, Addis Ababa',
            city: 'Addis Ababa',
            licenseNumber: 'GAR-001-2024',
            capacity: 20,
            availableSlots: 15,
            services: ['Oil Change', 'Brake Repair', 'Tire Rotation'],
            phone: '+251111223344',
            email: 'cityauto@garage.com',
            description: 'Professional auto repair service',
            owner: garageOwner1._id,
            status: 'approved',
            latitude: 9.0054,
            longitude: 38.7636
        });
        
        const garage2 = await Garage.create({
            name: 'Express Lube Garage',
            address: 'Megenagna, Addis Ababa',
            city: 'Addis Ababa',
            licenseNumber: 'GAR-002-2024',
            capacity: 15,
            availableSlots: 10,
            services: ['Car Wash', 'Oil Change', 'Engine Tune-up'],
            phone: '+251111334455',
            email: 'expresslube@garage.com',
            description: 'Quick lube and car wash services',
            owner: garageOwner2._id,
            status: 'approved',
            latitude: 9.0227,
            longitude: 38.7465
        });
        
        // Create Cars
const car1 = await Car.create({
    licensePlate: 'AA1234',
    vin: '1HGBH41JXMN109186',  // Add VIN
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    color: 'White',
    owner: carOwner1._id
});

const car2 = await Car.create({
    licensePlate: 'AA5678',
    vin: '5XYZU3LB8EG123456',  // Add VIN
    make: 'Honda',
    model: 'CR-V',
    year: 2021,
    color: 'Black',
    owner: carOwner1._id
});

const car3 = await Car.create({
    licensePlate: 'AA9012',
    vin: 'WBAFU9C53BC123789',  // Add VIN
    make: 'BMW',
    model: 'X5',
    year: 2019,
    color: 'Blue',
    owner: carOwner2._id
});
        
        console.log('\n✅ DATA SEEDED SUCCESSFULLY!');
        console.log('\n👥 Users Created:');
        console.log(`   Admin: ${admin.email} (password: admin123)`);
        console.log(`   Garage Owner 1: ${garageOwner1.email} (password: password123)`);
        console.log(`   Garage Owner 2: ${garageOwner2.email} (password: password123)`);
        console.log(`   Car Owner 1: ${carOwner1.email} (password: password123)`);
        console.log(`   Car Owner 2: ${carOwner2.email} (password: password123)`);
        console.log('\n🏢 Garages Created: 2');
        console.log('🚗 Cars Created: 3');
        console.log('🔧 Services Created: 5');
        console.log('\n🔑 Test Credentials:');
        console.log('   Admin: admin@car-garaging.com / admin123');
        console.log('   Car Owner: mike@example.com / password123');
        console.log('   Garage Owner: john@garage.com / password123');
        
        process.exit(0);
        
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seedData();