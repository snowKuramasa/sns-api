import express from 'express'
import type { Express } from 'express'
import tweetRoutes from './routes/tweetRoutes'
import helloRoutes from './routes/helloRoutes'
import authRoutes from './routes/authRoutes'
import bodyParser from 'body-parser'
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
// app.use(cors(corsOptions)) // アプリ全体に適用

// // ミドルウェア
// app.use(express.json()) // JSONパース

// ミドルウェア
app.use(cors())
app.use(bodyParser.json())

//接続確認用
app.use('/', helloRoutes)

// 認証ルート
app.use('/api/auth', authRoutes)

// ルート
app.use('/api/tweets', tweetRoutes)

export default app
