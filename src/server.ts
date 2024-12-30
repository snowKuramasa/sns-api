import app from './app'
import connectDB from './config/db'

const PORT = process.env.PORT || 3000

// サーバー起動
connectDB()
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
