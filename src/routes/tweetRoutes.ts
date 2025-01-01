import type { Request, Response } from 'express'
import { Router } from 'express'
import Tweet, { ITweet } from '../models/tweet'

const router: Router = Router()

//  ツイート一覧を取得
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const tweets = await Tweet.find()
    res.status(200).json(tweets)
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error })
  }
})

// 新しいツイートを作成
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, createrNickName, createrName, createrEmail } = req.body
    if (!content || !createrNickName || !createrName || !createrEmail) {
      res.status(400).json({ message: '全てのフィールドを入力してください' })
      return
    }

    const newTweet: ITweet = new Tweet({
      content,
      createrNickName,
      createrName,
      createrEmail,
    })
    await newTweet.save()
    res.status(201).json(newTweet)
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error })
  }
})

// 特定のツイートを削除
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    const tweet = await Tweet.findByIdAndDelete(id)

    if (!Tweet) {
      res.status(404).json({ message: 'ツイートが見つかりません' })
      return
    }

    res.status(200).json({ message: 'ツイートが削除されました' })
  } catch (error) {
    res.status(500).json({ message: 'サーバーエラー', error })
  }
})

export default router
