import { FaArrowRight } from 'react-icons/fa'
import { motion } from 'framer-motion'
import RegisterCTAImg from 'src/assets/images/registerCTA.png'
import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function RegisterCTA() {
  return (
    <section className='py-16 bg-gradient-to-br from-orange-50 via-white to-sky-50'>
      <div className='max-w-7xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.4 }}
          className='grid grid-cols-1 md:grid-cols-2 h-full min-h-[500px]'
        >
          <div className='bg-gradient-to-br from-white via-orange-100 to-white flex items-center justify-center p-10'>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className='rounded-xl overflow-hidden border-2 border-orange-200 shadow-inner p-4 bg-white'
            >
              <img src={RegisterCTAImg} alt='minh họa đăng ký miniapp' className='w-full h-auto object-contain' />
            </motion.div>
          </div>

          <div className='flex flex-col justify-center p-10 md:pl-18 text-center md:text-left'>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className='text-2xl md:text-4xl font-bold text-[#001858] leading-snug'
            >
              ĐĂNG KÝ TẠO MINIAPP
              <br />
              CHO DOANH NGHIỆP CỦA BẠN
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className='text-[#001858] mt-4 text-lg leading-relaxed max-w-xl'
            >
              Bạn đã tin tưởng chúng tôi và có ý tưởng cần triển khai? Hãy để Vietsunco biến điều đó thành hiện thực.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.8 }}
              viewport={{ once: true }}
              className='mt-8'
            >
              <Link
                to={path.register}
                className='bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full shadow-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 hover:scale-105'
              >
                Đăng ký ngay <FaArrowRight className='text-sm' />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
