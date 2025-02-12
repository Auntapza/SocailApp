import jwt from 'jsonwebtoken'
import 'dotenv/config'

export function verifytoken(token: string) {

    try {
        const payload = jwt.verify(token, process.env.JWT_CODE as string)
        return payload
    } catch {
        return false
    }

}

export function createToken(userId: string | number) {
    
    const payload = {
        userId
    }

    const token = jwt.sign(payload, process.env.JWT_CODE as string, {
        expiresIn: '3h'
    })

    return token

}