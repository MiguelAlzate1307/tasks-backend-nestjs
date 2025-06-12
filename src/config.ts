import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    name: process.env.DB_NAME,
  },
  jwt: {
    acc_secret: process.env.JWT_ACC_SECRET,
    acc_expires: process.env.JWT_ACC_EXPIRES,
    rsh_secret: process.env.JWT_RSH_SECRET,
    rsh_expires: process.env.JWT_RSH_EXPIRES,
  },
}));
