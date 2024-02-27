require('dotenv').config(); // This should be at the top

module.exports = {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // Ensure this is also set if your DB requires a specific port
    dialect: "mysql",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // Adjust based on your SSL configuration
        }
    }
};
