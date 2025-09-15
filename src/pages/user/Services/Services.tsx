import { motion } from 'framer-motion'
import bannerImage from 'src/assets/images/services-banner.png'
import RegisterCTA from 'src/components/RegisterCTA'
import ServiceList from 'src/components/ServiceList'
import LeftStroke from 'src/assets/images/stroke-left.png'
import RightStroke from 'src/assets/images/stroke-right.png'

import PricingSection from 'src/components/PricingSection'
import { Helmet } from 'react-helmet-async'

export default function Services() {
  return (
    <>
      <Helmet>
        <title>MiniApp Web | Dịch vụ</title>
        <meta
          name='description'
          content='Khám phá dịch vụ thiết kế và xây dựng MiniApp chuyên nghiệp của chúng tôi. Tạo trải nghiệm di động mượt mà và hấp dẫn cho người dùng của bạn ngay hôm nay!'
        />
      </Helmet>
      <section
        className='relative w-full h-[320px] md:h-[860px] flex items-center justify-center text-white object-contain'
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className='absolute inset-0 bg-black/5'></div>
        <motion.h1
          className='relative z-10 text-2xl md:text-6xl font-bold text-left text-[#002f6c] leading-tight '
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Dịch vụ
          <br />
          <span className='text-[#002f6c] '>Thiết kế và xây dựng MiniApp</span>
        </motion.h1>
      </section>

      <ServiceList />

      <section className='py-12 bg-gradient-to-tr from-[#fdfcfb] via-[#f7faff] to-[#edf6ff]'>
        <div className='max-w-4xl mx-auto px-6'>
          <div className='flex items-center justify-center gap-4 md:gap-6'>
            <motion.img
              src={LeftStroke}
              alt='left-stroke'
              className='w-20 md:w-40 object-contain'
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />
            <motion.p
              className='text-center text-sm md:text-xl font-bold text-gray-800'
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Hoặc bất kỳ ý tưởng nào bạn có!
            </motion.p>
            <motion.img
              src={RightStroke}
              alt='right-stroke'
              className='w-20 md:w-40 object-contain'
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            />
          </div>
        </div>
      </section>

      <PricingSection />

      <RegisterCTA />
    </>
  )
}
