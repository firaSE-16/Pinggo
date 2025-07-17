const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    // Create test users
    const users = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'John Doe',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Hello, I am John!',
        location: 'New York, USA'
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Jane Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'Hi there! I am Jane.',
        location: 'Los Angeles, USA'
      },
      {
        username: 'mike_wilson',
        email: 'mike@example.com',
        password: await bcrypt.hash('password123', 10),
        fullName: 'Mike Wilson',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'Hey! I am Mike.',
        location: 'Chicago, USA'
      }
    ];

    for (const userData of users) {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (!existingUser) {
        const user = await prisma.user.create({
          data: userData
        });
        console.log(`Created user: ${user.username} (${user.id})`);
      } else {
        console.log(`User already exists: ${existingUser.username} (${existingUser.id})`);
      }
    }

    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedUsers(); 