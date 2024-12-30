import type { Request, Response } from 'express'
import { Router } from 'express'

const router: Router = Router()

// ユーザー一覧を取得
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).send('Hello, World! 😊')
  } catch (error) {
    res.status(500).send('Server Error 😣')
  }
})

export default router
