import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SuccessDialogProps {
  open: boolean
  message: string
  onAutoClose: () => void
}

export default function SuccessDialog({ open, message, onAutoClose }: SuccessDialogProps) {
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onAutoClose()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [open, onAutoClose])

  return (
    <AnimatePresence>
      {open && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm'>
          <motion.div
            initial={{ y: -50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className='bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative'
          >
            <div className='mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-green-50 shadow-md'>
              <svg
                className='w-12 h-12 text-green-500'
                fill='none'
                stroke='currentColor'
                strokeWidth={2.5}
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
              </svg>
            </div>

            <h2 className='mt-6 text-2xl font-extrabold text-gray-800'>Đăng ký thành công!</h2>

            <p className='text-gray-600 mt-3 leading-relaxed'>{message}</p>

            <p className='mt-4 text-sm text-gray-400'>
              Bạn sẽ được chuyển về <span className='font-semibold text-gray-600'>Trang chủ</span> trong giây lát...
            </p>

            <div className='mt-6 w-full h-1 bg-gray-200 rounded-full overflow-hidden'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className='h-full bg-green-500'
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
