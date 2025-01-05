require('dotenv').config();

module.exports = {
    apps: [
        {
            name: "server",
            script: "./output.js",
            env: {
                DB_URI: process.env.DB_URI,
                PORT: process.env.PORT || 8000,
                JWT_SECRECT_KEY: process.env.JWT_SECRECT_KEY,
                JWT_USER_EXPIRES_IN: process.env.JWT_USER_EXPIRES_IN,
                JWT_ADMIN_EXPIRES_IN: process.env.JWT_ADMIN_EXPIRES_IN,
                SERVER_HOST: process.env.SERVER_HOST,
                sender_code: process.env.sender_code,
                NODE_ENV: process.env.NODE_ENV || "production",
                BACKEND_URL: process.env.BACKEND_URL,
                OTP_KEY: process.env.OTP_KEY,
            },
        },
    ],
};
