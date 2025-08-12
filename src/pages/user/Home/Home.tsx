import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import HeroImage from 'src/assets/images/hero-minapp.png'
import BenefitsSection from 'src/components/BenefitsSection'
import CustomerSay from 'src/components/CustomerSay'
import FeatureHighlight from 'src/components/FeatureHighlight'
import ProjectTimeline from 'src/components/ProjectTimeline'
import RegisterCTA from 'src/components/RegisterCTA'
import path from 'src/constants/path'

const features = [
  {
    title: 'Ứng dụng nhỏ gọn',
    description:
      'Chạy trực tiếp trong các siêu ứng dụng phổ biến như Zalo, MoMo, Grab, mang lại sự tiện lợi tối đa cho người dùng.'
  },
  {
    title: 'Truy cập tức thì',
    description:
      'Không yêu cầu cài đặt, giúp người dùng trải nghiệm liền mạch và nhanh chóng, loại bỏ rào cản truy cập.'
  },
  {
    title: 'Tận dụng hệ sinh thái',
    description:
      'Các siêu ứng dụng có hơn 75 triệu người dùng tại Việt Nam. Mini App giúp bạn khai thác trực tiếp tập khách hàng khổng lồ này.'
  }
]

export default function Home() {
  return (
    <main>
      <section className='py-16'>
        <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-y-48'>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className='text-3xl md:text-4xl font-semibold text-gray-900 mt-4 mb-4'>
              Dịch vụ thiết kế và xây dựng MiniApp
            </h1>
            <p className='text-xl font-semibold text-gray-800 mb-6'> Giải pháp kinh doanh toàn diện cho doanh nghiệp</p>
            <ul className='space-y-3 text-gray-700 list-none'>
              {[
                '✨ Tiếp cận hàng triệu người dùng tiềm năng mà không cần quảng bá ứng dụng riêng',
                '✨ Giảm 50–70% chi phí phát triển và bảo trì so với ứng dụng di động truyền thống',
                '✨ Giao diện app được thiết kế theo độ nhận diện thương hiệu của khách hàng',
                '✨ Hơn 30 tính năng phù hợp với đa dạng mô hình kinh doanh',
                '✨ Triển khai chỉ trong 4–8 tuần giúp tiết kiệm chi phí – Tăng hiệu quả kinh doanh'
              ].map((item, index) => (
                <li key={index} className='leading-relaxed'>
                  {item}
                </li>
              ))}
            </ul>
            <div className='mt-8 flex flex-wrap gap-4'>
              <Link
                to={path.register}
                className='bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition'
              >
                Đăng ký ngay
              </Link>
              <button className='border border-orange-500 text-orange-500 px-6 py-3 rounded-md font-semibold hover:bg-orange-100 transition'>
                Liên hệ tư vấn ngay
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='flex justify-end'
          >
            <img src={HeroImage} alt='Hero MiniApp' className=' w-[572px] h-[428] mt-4 ' />
          </motion.div>
        </div>
      </section>

      <section className='bg-[#FFF7F0] py-16'>
        <div className='max-w-7xl mx-auto px-6'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center'>
            Mini App là gì? <span className='text-black/80'>Sức mạnh từ sự kết hợp</span>
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className='bg-orange-200 rounded-xl p-6 shadow-sm hover:shadow-md transition '
              >
                <h3 className='text-2xl text-center font-bold text-black mb-3'>{feature.title}</h3>
                <p className='text-gray-700 leading-normal text-xl text-justify'>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FeatureHighlight />
      <ProjectTimeline />
      <BenefitsSection />
      <CustomerSay />
      <RegisterCTA />
    </main>
  )
}
