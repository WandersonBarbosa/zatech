const JWT_SECRET = process.env.TOKEN_ATLAZ!

export function verifyToken(token: string): boolean {
    return token === JWT_SECRET
}


