import { Star, MessageSquare } from 'lucide-react'
import { useState } from 'react'

type Comment = {
  id: number
  user: string
  date: string
  rating: number
  content: string
}

const initialComments: Comment[] = [
  { id: 1, user: 'Nguyễn Văn A', date: '10/08/2025', rating: 5, content: 'Dịch vụ rất tốt, hỗ trợ nhiệt tình!' },
  { id: 2, user: 'Trần Thị B', date: '12/08/2025', rating: 4, content: 'Sản phẩm ổn, tiến độ đúng hạn.' },
  {
    id: 3,
    user: 'Phạm Văn C',
    date: '14/08/2025',
    rating: 3,
    content: 'Có vài điểm cần cải thiện nhưng nhìn chung ổn.'
  }
]

export default function ProjectComment() {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [newRating, setNewRating] = useState(0)

  const avgRating = comments.length > 0 ? comments.reduce((sum, c) => sum + c.rating, 0) / comments.length : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment || newRating === 0) return

    const newEntry: Comment = {
      id: comments.length + 1,
      user: 'Bạn',
      date: new Date().toLocaleDateString('vi-VN'),
      rating: newRating,
      content: newComment
    }

    setComments([newEntry, ...comments])
    setNewComment('')
    setNewRating(0)
  }

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-2xl font-bold mb-2'>Đánh giá dịch vụ</h1>
        <p className='text-gray-600'>Xem và gửi đánh giá của bạn về dự án</p>
      </div>

      {/* Overview */}
      <div className='bg-white p-6 rounded-lg shadow flex items-center justify-between'>
        <div>
          <h2 className='text-lg font-semibold flex items-center gap-2'>
            <MessageSquare className='text-orange-500' size={20} /> Tổng quan
          </h2>
          <p className='text-4xl font-bold text-orange-500 mt-2'>{avgRating.toFixed(1)}</p>
          <div className='flex gap-1 mt-1'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <p className='text-gray-500 text-sm mt-1'>{comments.length} đánh giá</p>
        </div>
      </div>

      {/* Form */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-4'>Viết đánh giá của bạn</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Rating */}
          <div className='flex gap-2'>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={28}
                onClick={() => setNewRating(i + 1)}
                className={`cursor-pointer transition ${
                  i < newRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 hover:text-yellow-400'
                }`}
              />
            ))}
          </div>

          {/* Input */}
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder='Nhập đánh giá của bạn...'
            className='w-full p-3 border rounded-md text-sm focus:ring-2 focus:ring-orange-400'
          />

          {/* Submit */}
          <button
            type='submit'
            className='bg-orange-500 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition'
          >
            Gửi đánh giá
          </button>
        </form>
      </div>

      {/* Comment List */}
      <div className='space-y-4'>
        <h2 className='text-lg font-semibold'>Các đánh giá gần đây</h2>
        {comments.map((c) => (
          <div key={c.id} className='bg-white p-4 rounded-lg shadow flex items-start gap-4'>
            <div className='flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-600'>
              {c.user.charAt(0)}
            </div>
            <div className='flex-grow'>
              <div className='flex items-center justify-between'>
                <p className='font-semibold text-gray-800'>{c.user}</p>
                <span className='text-sm text-gray-500'>{c.date}</span>
              </div>
              <div className='flex gap-1 my-1'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < c.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <p className='text-gray-700 text-sm'>{c.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
