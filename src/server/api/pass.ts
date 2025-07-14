import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

const SALT_ROUNDS = 10; // Количество раундов для генерации соли

async function hashPassword(password: string): Promise<string> {
    // Генерация соли и хеширование пароля
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

// Пример использования
// (async () => {
//     const password = "mySecurePassword";
//     const hashedPassword = await hashPassword(password);
//     console.log("Hashed Password:", hashedPassword);
// })();
