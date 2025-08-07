import { HiCheckBadge } from 'react-icons/hi2'
import { motion } from 'framer-motion'

const plans = [
  {
    title: 'Basic',
    price: '10.000.000 đ',
    features: ['Mua hàng/ đặt món/ đặt dịch vụ', 'Đặt lịch/ Đặt chỗ', 'Tích hợp location', 'Hỗ trợ'],
    highlight: false
  },
  {
    title: 'Plus',
    price: '20.000.000 đ',
    features: [
      'Mua hàng/ đặt món/ đặt dịch vụ',
      'Đặt lịch/ Đặt chỗ',
      'Tích hợp location',
      'Hỗ trợ',
      'Tích điểm nhận thưởng',
      'Chat tương tác'
    ],
    highlight: false
  },
  {
    title: 'Pro',
    price: 'Liên hệ',
    features: [
      'Mua hàng/ đặt món/ đặt dịch vụ',
      'Đặt lịch/ Đặt chỗ',
      'Tích hợp location',
      'Hỗ trợ',
      'Tích điểm nhận thưởng',
      'Chat tương tác',
      'Thiết kế theo yêu cầu'
    ],
    highlight: true
  }
]

export default function PricingTable() {
  return (
    <section className='bg-gradient-to-tr from-[#fdfcfb] via-[#f7faff] to-[#edf6ff] py-24'>
      <div className='max-w-6xl mx-auto px-6'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900'>Bảng giá Mini App</h2>
          <p className='text-gray-600 max-w-xl mx-auto mt-3 text-sm md:text-base'>
            Chúng tôi cung cấp nhiều gói phù hợp với nhu cầu và ngân sách của bạn.
          </p>
        </div>

        <div className='grid md:grid-cols-3 gap-10'>
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.1, delay: 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white rounded-3xl border border-gray-200 px-6 py-10 shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-[320px] mx-auto min-h-[480px] ${
                plan.highlight ? 'ring-2 ring-orange-400 ring-opacity-80' : ''
              }`}
            >
              {plan.highlight && (
                <div className='absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-sm'>
                  Phổ biến nhất
                </div>
              )}

              <h3 className='text-center text-2xl font-bold text-orange-500 mb-1'>{plan.title}</h3>

              <p
                className={`text-center text-2xl font-bold mb-1 ${
                  plan.price === 'Liên hệ' ? 'text-red-500' : 'text-gray-900'
                }`}
              >
                {plan.price}
              </p>
              <p className='text-center text-sm text-gray-500 mb-6'>/gói</p>

              <div className='border-t border-gray-200 pt-6'>
                <p className='text-sm font-medium text-gray-700 mb-3'>Bao gồm:</p>
                <ul className='space-y-3'>
                  {plan.features.map((feature, i) => (
                    <li key={i} className='flex items-start gap-2 text-gray-700 text-sm'>
                      <HiCheckBadge className='text-orange-500 text-lg mt-[2px]' />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
