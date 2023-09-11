const Sequelize = require('sequelize');

const sequelize = new Sequelize('database_speech', 'database_speech', 'database_speech', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;