const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 5000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.log('Failed to sync database or start server:', error.message);
  process.exit(1);
});
