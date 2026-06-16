const env = {
    NODE_ENV: "production",
    DB_HOST: "localhost",
    DB_PORT: 3306,
    DB_USERNAME: "root",
    DB_PASSWORD: "ows@123",
    DB_NAME: "chat_app",
    JWT_SECRET: "your_jwt_secret_key",
    ALLOWED_ORIGINS: "http://192.168.29.7:3000",
    PORT: 4000,
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: 465,
    SMTP_USERNAME: "bapitawork@gmail.com",
    SMTP_PASSWORD: "rdjhemkpqdcllrxs",
    REDIS_HOST: "localhost",
    REDIS_PORT: 6379,
    TOKEN_EXPIRE: "20m",
    REDIS_EXPIRE: 900
}
module.exports = {
    apps: [
        {
            name: "api-4000",
            script: "dist/main.js",
            instances: 1,
            env: {
                ...env,
                PORT: 4000
            }
        },
        {
            name: "api-4001",
            script: "dist/main.js",
            instances: 1,
            env: {
                ...env,
                PORT: 4001
            }
        },
        {
            name: "api-4002",
            script: "dist/main.js",
            instances: 1,
            env: {
                ...env,
                PORT: 4002
            }
        }
    ]
}