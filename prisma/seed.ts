import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create test users for each role
  const users = [
    {
      email: 'manager@example.com',
      password: await hash('managerpass', 12),
      name: 'HR Manager',
      role: 'hr_manager',
    },
    {
      email: 'recruiter@example.com',
      password: await hash('recruiterpass', 12),
      name: 'HR Recruiter',
      role: 'hr_recruiter',
    },
    {
      email: 'interviewer@example.com',
      password: await hash('interviewerpass', 12),
      name: 'Interviewer',
      role: 'interviewer',
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('Database has been seeded. 🌱');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 