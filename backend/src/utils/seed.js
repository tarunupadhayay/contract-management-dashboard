require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Contract = require('../models/Contract');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Contract.deleteMany({});
    console.log('Cleared existing data.');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✅ Admin user created: admin@example.com / admin123');

    // Create regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
    });
    console.log('✅ Regular user created: john@example.com / user123');

    // Create sample contracts
    const contracts = [
      {
        title: 'Cloud Infrastructure Service Agreement',
        description:
          'Annual agreement for AWS cloud infrastructure services including compute, storage, and networking resources for the enterprise platform.',
        parties: ['TechCorp Inc.', 'AWS Solutions Ltd.'],
        startDate: new Date('2025-01-01'),
        endDate: new Date('2026-01-01'),
        status: 'Active',
        createdBy: admin._id,
      },
      {
        title: 'Software License Agreement - Enterprise Suite',
        description:
          'License agreement for the Enterprise Suite software including 500 user seats, premium support, and annual upgrades.',
        parties: ['InnovateTech Solutions', 'Microsoft Corporation'],
        startDate: new Date('2025-03-15'),
        endDate: new Date('2026-03-15'),
        status: 'Active',
        createdBy: user._id,
      },
      {
        title: 'Marketing Services Contract',
        description:
          'Digital marketing services including SEO, SEM, social media management, and content creation for Q1-Q2 2025.',
        parties: ['Digital Dynamics Agency', 'GrowFast Startup'],
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-06-30'),
        status: 'Executed',
        createdBy: admin._id,
      },
      {
        title: 'Office Lease Agreement',
        description:
          'Commercial office lease for Suite 400, Building A, covering 5000 sqft of premium office space in the downtown business district.',
        parties: ['Pinnacle Realty Group', 'TechCorp Inc.'],
        startDate: new Date('2024-06-01'),
        endDate: new Date('2027-05-31'),
        status: 'Active',
        createdBy: admin._id,
      },
      {
        title: 'Consulting Engagement - Data Migration',
        description:
          'Professional consulting engagement for migrating legacy database systems to modern cloud-based solutions. Includes assessment, planning, execution, and testing phases.',
        parties: ['DataPro Consulting', 'Legacy Systems Corp', 'CloudFirst Inc.'],
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-08-31'),
        status: 'Active',
        createdBy: user._id,
      },
      {
        title: 'NDA - Product Collaboration',
        description:
          'Non-disclosure agreement covering confidential information shared during joint product development and collaboration activities.',
        parties: ['InnovateTech Solutions', 'PartnerCo Global'],
        startDate: new Date('2025-04-01'),
        endDate: new Date('2026-04-01'),
        status: 'Draft',
        createdBy: user._id,
      },
      {
        title: 'Maintenance & Support Contract',
        description:
          'Annual maintenance and 24/7 technical support contract for enterprise network infrastructure including routers, switches, firewalls, and VPN systems.',
        parties: ['NetSecure Technologies', 'TechCorp Inc.'],
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'Expired',
        createdBy: admin._id,
      },
      {
        title: 'Freelance Design Services Agreement',
        description:
          'Contract for UI/UX design services for the new customer portal redesign project, including wireframing, prototyping, and final design deliverables.',
        parties: ['Creative Studios LLC', 'TechCorp Inc.'],
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-09-30'),
        status: 'Draft',
        createdBy: user._id,
      },
    ];

    for (const contractData of contracts) {
      const contract = await Contract.create({
        ...contractData,
        activityLog: [
          {
            action: 'CREATED',
            performedBy: contractData.createdBy,
            details: `Contract "${contractData.title}" created`,
          },
        ],
      });
      console.log(`  📄 Created contract: ${contract.title}`);
    }

    console.log(`\n🎉 Seed complete! Created 2 users and ${contracts.length} contracts.`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
