'use client'

import { motion } from 'framer-motion'

const steps = [
  {
    title: 'Lập lịch cho dự án',
    content:
      'Sau khi nắm rõ nhu cầu và mục tiêu sử dụng của khách hàng, lập kế hoạch phát triển, phân chia giai đoạn cho nhân sự.'
  },
  {
    title: 'Thiết kế hệ thống',
    content: 'Thiết kế flowchart, phân chia module chức năng, thiết kế mockup UI/UX (giao diện người dùng).'
  },
  {
    title: 'Tiến hành lập trình',
    content:
      'Tiến hành lập trình giao diện (front-end), và các chức năng xử lý (back-end), đồng thời kiểm thử và thử nghiệm thực tế.'
  },
  {
    title: 'Hoàn thiện sản phẩm',
    content: 'Nhận feedback và sửa chữa theo yêu cầu, triển khai sản phẩm hoàn chỉnh và hỗ trợ bảo trì sau triển khai.'
  }
]

export default function ProjectTimeline() {
  return (
    <section className='bg-white py-16'>
      <div className='max-w-5xl mx-auto px-6'>
        <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-20'>Quy trình thực hiện dự án</h2>

        <div className='relative'>
          <div className='absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-[3px] bg-orange-300 z-0' />

          <div className='flex flex-col gap-16 relative z-10'>
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className='flex flex-col md:flex-row items-center justify-between relative'
                >
                  <div className={`w-full md:w-[45%] px-4 ${isLeft ? '' : 'hidden md:block'}`}>
                    {isLeft && (
                      <div className='text-center bg-orange-50 p-6 rounded-xl shadow-md hover:shadow-lg transition'>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>{step.title}</h3>
                        <p className='text-base text-gray-700 leading-relaxed'>{step.content}</p>
                      </div>
                    )}
                  </div>

                  <div className='relative z-20 flex flex-col items-center'>
                    <div className='w-10 h-10 flex items-center justify-center bg-orange-500 text-white font-bold rounded-md shadow-md border-4 border-white'>
                      {index + 1}
                    </div>
                    <div
                      className={`absolute top-1/2 w-10 h-[2px] bg-orange-300 ${
                        isLeft ? 'right-10' : 'left-10'
                      } hidden md:block`}
                    />
                  </div>

                  <div className={`w-full md:w-[45%] px-4 ${!isLeft ? '' : 'hidden md:block'}`}>
                    {!isLeft && (
                      <div className='text-center bg-orange-50 p-6 rounded-xl shadow-md hover:shadow-lg transition'>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>{step.title}</h3>
                        <p className='text-base text-gray-700 leading-relaxed'>{step.content}</p>
                      </div>
                    )}
                  </div>

                  <div className='md:hidden mt-4 px-4'>
                    {!isLeft && (
                      <div className='text-center bg-orange-50 p-6 rounded-xl shadow-md hover:shadow-lg transition'>
                        <h3 className='text-xl font-semibold text-gray-900 mb-2'>{step.title}</h3>
                        <p className='text-base text-gray-700 leading-relaxed'>{step.content}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
