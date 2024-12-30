import express from 'express'
import type { Express } from 'express'
import userRoutes from './routes/userRoutes'
import helloRoutes from './routes/helloRoutes'

const app: Express = express()

// ミドルウェア
app.use(express.json()) // JSONパース

//接続確認用
app.use('/', helloRoutes)

// ルート
app.use('/api/user', userRoutes)

export default app
