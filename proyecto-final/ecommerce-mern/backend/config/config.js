import dotenv from "dotenv";

dotenv.config(); //Nos permitirá trabajar con las variables de entorno del archivo ".env"

export default {
    mailService : process.env.MAIL_SERVICE,
    mailPort :process.env.MAIL_PORT,
    mailFrom : process.env.MAIL_FROM,
    mailPass : process.env.MAIL_PASS,
    mailHost : process.env.MAIL_HOST,
    frontEndUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
}