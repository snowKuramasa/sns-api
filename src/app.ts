import express from 'express'
import type { Express } from 'express'
import userRoutes from './routes/userRoutes'
import helloRoutes from './routes/helloRoutes'
import cors from 'cors'

const app: Express = express()

// CORSの全体設定（アプリ全体に適用）
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',')

// CORS設定
const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins?.includes(origin)) {
      // 許可されたオリジンからのリクエストを許可
      callback(null, true)
    } else {
      // 許可されていないオリジンからのリクエストを拒否
      callback(
        new Error('CORSエラー: 許可されていないオリジンからのリクエストです')
      )
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

// CORSミドルウェアの設定
app.use(cors(corsOptions)) // アプリ全体に適用

// ミドルウェア
app.use(express.json()) // JSONパース

//接続確認用
app.use('/', helloRoutes)

// ルート
app.use('/api/users', userRoutes)

export default app
