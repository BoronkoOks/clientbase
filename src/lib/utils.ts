import jwt from 'jsonwebtoken'
import cookie, { SerializeOptions } from 'cookie'

export const generatePagination = (currentPage: number, totalPages: number) => {
  if (totalPages <= 7) {
    return Array.from({length: totalPages}, (_, i) => i + 1)
  }

  if (currentPage <= 3) {
    return [1, ,2, 3, '...', totalPages - 1, totalPages]
  }

  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
  }

  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
}

export function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}


// Функция для генерации токена
export function generateToken(payload: object, expiresIn: string = '1h'): string {
    // Генерация токена
    const token = jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn });
    return token;
}


export function getCookies(req: Request) {
  const cookieHeader = req.headers.get('Cookie')
  if (!cookieHeader) return {}
  return cookie.parse(cookieHeader)
}

export function getCookie(req: Request, name: string) {
  const cookieHeader = req.headers.get('Cookie')
  if (!cookieHeader) return
  const cookies = cookie.parse(cookieHeader)
  return cookies[name]
}

export function setCookie(
  resHeaders: Headers,
  name: string,
  value: string,
  options?: SerializeOptions
) {
  resHeaders.append('Set-Cookie', cookie.serialize(name, value, options))
}


