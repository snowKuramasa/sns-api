// src/routes/auth.ts
import express, { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import axios from 'axios'
import User from '../models/user'
import mongoose from 'mongoose'

import dotenv from 'dotenv'

// 環境変数の読み込み
dotenv.config()

const router = express.Router()

// 環境変数
const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRY = process.env.JWT_EXPIRY!

// 手動ログイン
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    })
    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// 会員登録エンドポイント
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    // すでに同じメールアドレスが存在するか確認
    const existingUser = await User.findOne({ email })
    console.log(existingUser)
    if (existingUser) {
      res.status(400).json({ message: 'Email already registered' })
      return
    }

    console.log('パスワードのハッシュ化')

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10)

    console.log('新しいユーザーを作成')
    console.log(password)
    console.log(hashedPassword)
    console.log(email)

    // 新しいユーザーを作成
    const newUser = new User({
      email,
      password: hashedPassword,
      provider: 'manual',
    })
    console.log(newUser)

    await newUser.save()

    // ユーザーにJWTトークンを発行
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    })

    res.status(201).json({
      message: 'User registered successfully',
      token,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Google OAuth
router.get('/google', (req: Request, res: Response) => {
  console.log('google')
  const queryParams = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.REDIRECT_URI!,
    response_type: 'code',
    scope: 'openid email profile',
  })

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${queryParams.toString()}`
  res.redirect(googleAuthUrl)
})

router.get('/google/callback', async (req: Request, res: Response) => {
  console.log(req.query)
  const { code } = req.query

  if (!code) return res.redirect('/login?error=missing_code')

  try {
    const tokenResponse = await axios.post(
      'https://oauth2.googleapis.com/token',
      {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.REDIRECT_URI!,
        grant_type: 'authorization_code',
      }
    )

    const { id_token } = tokenResponse.data
    const decodedToken: any = jwt.decode(id_token)

    const email = decodedToken.email

    let user = await User.findOne({ email })
    if (!user) {
      user = new User({
        email,
        password: 'oauth',
        provider: 'google',
      })
      await user.save()
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRY,
    })
    res.json({ token })
  } catch (err) {
    console.error(err)
    res.redirect('/login?error=auth_failed')
  }
})

export default router
