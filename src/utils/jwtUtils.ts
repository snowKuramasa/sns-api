// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

declare module 'express-serve-static-core' {
  interface Request {
    user?: { id: string }
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ message: 'Access denied, no token provided' })
  }

  try {
    // JWTトークンの検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
    req.user = decoded // リクエストオブジェクトにユーザー情報を追加
    next() // 次のミドルウェアまたはルート処理に進む
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}
