const sequelize = require('./config/db');

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Exito');
    } catch (error) {
        console.error('Error', error);
    } finally {
        await sequelize.close();
    }
}

testConnection();