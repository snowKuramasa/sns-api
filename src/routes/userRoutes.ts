import type { Request, Response } from 'express'
import { Router } from 'express'
import User, { IUser } from '../models/User'

const router: Router = Router()

// ユーザー一覧を取得
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error })
  }
})

// 新しいユーザーを作成
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      res.status(400).json({ message: '全てのフィールドを入力してください' })
      return
    }

    const newUser: IUser = new User({ name, email, password })
    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error })
  }
})

// 特定のユーザーを削除
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      res.status(404).json({ message: 'ユーザーが見つかりません' })
      return
    }

    res.status(200).json({ message: 'ユーザーが削除されました' })
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error })
  }
})

export default router
