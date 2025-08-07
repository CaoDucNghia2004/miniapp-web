import { FaBullseye, FaRocket, FaWrench, FaLock } from 'react-icons/fa'
import { motion } from 'framer-motion'

const benefits = [
  {
    icon: <FaBullseye className='text-red-500 text-4xl' />,
    title: 'Dễ tiếp cận người dùng',
    description: 'Triển khai nhanh, không cần tải app'
  },
  {
    icon: <FaWrench className='text-indigo-600 text-4xl' />,
    title: 'Dễ bảo trì',
    description: 'Hệ thống đơn giản, chỉnh sửa nội dung nhanh nên dễ bảo trì'
  },
  {
    icon: <FaRocket className='text-pink-500 text-4xl' />,
    title: 'Tiết kiệm chi phí',
    description: 'Chi phí nhân lực vận hành, bảo trì thấp'
  },
  {
    icon: <FaLock className='text-yellow-500 text-4xl' />,
    title: 'Bảo mật cao',
    description: 'Phân quyền nội bộ, đồng thời bảo vệ dữ liệu khách hàng'
  }
]

export default function BenefitSection() {
  return (
    <section className='bg-white py-16'>
      <div className='max-w-5xl mx-auto px-6'>
        <h2 className='text-3xl md:text-4xl font-bold text-center mb-3'>4 lợi ích cho thấy bạn nên có một MiniApp</h2>
        <p className='text-center text-gray-600 mb-14 max-w-2xl mx-auto leading-'>
          Đơn vị hàng đầu trong việc thiết kế MiniApp Việt Nam, giúp doanh nghiệp sở hữu một ứng dụng nhỏ với nhiều giải
          pháp tiện dụng
        </p>

        <div className='flex flex-col gap-28'>
          <div className='grid grid-cols-1 md:grid-cols-2 -translate-x-16 md:-translate-x-30 '>
            {benefits.slice(0, 2).map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className='flex flex-col items-center text-center'
              >
                {benefit.icon}
                <h3 className='text-lg font-semibold text-gray-900 mt-3 mb-1'>{benefit.title}</h3>
                <p className='text-gray-700 text-sm max-w-[220px]'>{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 translate-x-16 md:translate-x-40'>
            {benefits.slice(2, 4).map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className='flex flex-col items-center text-center'
              >
                {benefit.icon}
                <h3 className='text-lg font-semibold text-gray-900 mt-3 mb-1'>{benefit.title}</h3>
                <p className='text-gray-700 text-sm max-w-[220px]'>{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
