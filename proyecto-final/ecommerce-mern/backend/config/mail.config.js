import config from './config.js';
import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport({
    service: config.mailService,
    host: config.mailHost,
    port: config.mailPort, //587 puerto por default de GMAIL - Se encuentra como puerto SMTP
    auth: {
        user: config.mailFrom,
        pass: config.mailPass
    }
})