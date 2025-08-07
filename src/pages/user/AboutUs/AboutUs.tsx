import { Link } from 'react-router-dom'
import { FaRocket, FaBullseye, FaGem, FaLightbulb } from 'react-icons/fa'
import { motion } from 'framer-motion'
import ImageSlider from 'src/components/ImageSlider'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6
    }
  })
}

export default function AboutUs() {
  return (
    <div className='bg-white text-gray-800'>
      <section className='bg-gradient-to-b from-orange-50 to-white py-16 text-center px-4'>
        <motion.div initial='hidden' whileInView='visible' viewport={{ once: true }}>
          <motion.div custom={0} variants={fadeInUp}>
            <FaLightbulb className='text-5xl text-orange-400 mx-auto mb-4 animate-bounce' />
          </motion.div>
          <motion.h1 className='text-4xl md:text-5xl font-bold text-orange-600 mb-6' custom={1} variants={fadeInUp}>
            Về Vietsunco
          </motion.h1>
          <motion.p
            className='text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed'
            custom={2}
            variants={fadeInUp}
          >
            Chúng tôi giúp doanh nghiệp Việt Nam tạo ra MiniApp nhanh chóng, tiết kiệm và hiệu quả cao, nhằm tăng trưởng
            bền vững trong kỷ nguyên số.
          </motion.p>
        </motion.div>
      </section>
      <section className='mt-5 mb-10 bg-white px-4'>
        <motion.div
          className='max-w-5xl mx-auto space-y-16'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          {[
            {
              icon: <FaRocket className='text-orange-500 text-2xl' />,
              title: 'Sứ mệnh',
              desc: 'Tối ưu hóa giải pháp số và thúc đẩy chuyển đổi số toàn diện cho SME Việt Nam.',
              bg: 'from-[#FFE5D9] to-[#FFB199]'
            },
            {
              icon: <FaBullseye className='text-pink-600 text-2xl' />,
              title: 'Tầm nhìn',
              desc: 'Trở thành nhà cung cấp MiniApp hàng đầu Đông Nam Á vào năm 2030.',
              bg: 'from-[#FDE2F3] to-[#F9A8D4]'
            },
            {
              icon: <FaGem className='text-yellow-500 text-2xl' />,
              title: 'Giá trị cốt lõi',
              desc: 'Nhanh chóng – Hiệu quả – Tận tâm – Đồng hành cùng doanh nghiệp.',
              bg: 'from-[#FFF9D9] to-[#FDE68A]'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className={`relative bg-gradient-to-r ${item.bg} text-gray-900 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:gap-10`}
              custom={index}
              variants={{
                hidden: { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    delay: index * 0.2,
                    duration: 0.6
                  }
                }
              }}
            >
              <div className='w-14 h-14 min-w-14 min-h-14 rounded-full bg-white flex items-center justify-center shadow-md mb-4 md:mb-0'>
                {item.icon}
              </div>
              <div className='text-left'>
                <h3 className='text-xl md:text-2xl font-bold mb-2'>{item.title}</h3>
                <p className='text-sm md:text-base leading-relaxed'>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
      <section className='bg-gradient-to-b from-orange-50 via-white to-yellow-50 py-15 px-4'>
        <motion.div
          className='max-w-5xl mx-auto text-center'
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-10' variants={fadeInUp}>
            Thiết kế MiniApp đẹp, hiện đại, đúng nhu cầu
          </motion.h2>
          <motion.div
            className='relative w-full max-w-4xl mx-auto aspect-[16/9] rounded-2xl overflow-hidden shadow-xl border border-orange-200'
            variants={fadeInUp}
            custom={1}
          >
            <ImageSlider />
          </motion.div>
        </motion.div>
      </section>
      <section className='bg-gradient-to-r from-orange-100 to-pink-100 py-16 text-gray-800 text-center px-4'>
        <motion.div initial='hidden' whileInView='visible' viewport={{ once: true }}>
          <motion.div variants={fadeInUp}>
            <FaRocket className='text-5xl text-orange-400 mx-auto mb-4 animate-pulse' />
          </motion.div>
          <motion.h2 className='text-3xl md:text-4xl font-bold mb-4' variants={fadeInUp} custom={1}>
            Sẵn sàng cùng Vietsunco chuyển mình trong thời đại số?
          </motion.h2>
          <motion.p className='mb-8 text-lg md:text-xl max-w-2xl mx-auto' variants={fadeInUp} custom={2}>
            Chúng tôi ở đây để đồng hành và xây dựng giải pháp MiniApp tối ưu nhất cho doanh nghiệp của bạn.
          </motion.p>
          <motion.div variants={fadeInUp} custom={3}>
            <Link
              to='#'
              className='inline-block bg-orange-500 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-orange-600 transition transform duration-300'
            >
              Liên hệ ngay
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}
