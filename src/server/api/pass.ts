import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

const SALT_ROUNDS = 10; // Количество раундов для генерации соли

export async function hashPassword(password: string): Promise<string> {
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


export async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
}

// // Пример использования
// (async () => {
//     const password = "mySecurePassword";
//     const hashedPassword = await hashPassword(password); // Хешируем пароль

//     const isMatch = await comparePasswords("mySecurePassword", hashedPassword);
//     console.log("Passwords match:", isMatch); // true
// })();
