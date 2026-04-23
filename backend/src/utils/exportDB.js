require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('../models/User');
const Contract = require('../models/Contract');

const exportDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for export...');

    const dumpDir = path.join(__dirname, '../../db_dump/contract_management');
    fs.mkdirSync(dumpDir, { recursive: true });

    // Export users (include password for restore)
    const users = await User.find({}).select('+password').lean();
    fs.writeFileSync(
      path.join(dumpDir, 'users.json'),
      JSON.stringify(users, null, 2)
    );
    console.log(`✅ Exported ${users.length} users`);

    // Export contracts
    const contracts = await Contract.find({}).lean();
    fs.writeFileSync(
      path.join(dumpDir, 'contracts.json'),
      JSON.stringify(contracts, null, 2)
    );
    console.log(`✅ Exported ${contracts.length} contracts`);

    console.log(`\n🎉 DB dump saved to: ${dumpDir}`);
    process.exit(0);
  } catch (error) {
    console.error('Export error:', error);
    process.exit(1);
  }
};

exportDB();
