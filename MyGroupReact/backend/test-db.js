
const { sequelize } = require('./config/database');
const models = require('./models');

async function testDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    
    // Test model sync
    await sequelize.sync({ alter: false });
    console.log('✅ Database models synchronized successfully.');
    
    // Test a simple query
    const users = await models.User.findAll({ limit: 1 });
    console.log(`✅ Database query successful. Found ${users.length} user(s).`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
}

testDatabase();
