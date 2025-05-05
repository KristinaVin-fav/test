import { Sequelize } from 'sequelize';
import { config } from 'dotenv';
config();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, // Преобразование в строку
  {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    charset: 'utf8', // Добавляем кодировку
    define: {
      underscored: true,
      timestamps: false,
    },
  }
);
export default sequelize;