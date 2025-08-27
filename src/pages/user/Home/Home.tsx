import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

import HeroImage from 'src/assets/images/hero-minapp.png'
import BenefitsSection from 'src/components/BenefitsSection'
import CustomerSay from 'src/components/CustomerSay'
import FeatureHighlight from 'src/components/FeatureHighlight'
import ProjectTimeline from 'src/components/ProjectTimeline'
import RegisterCTA from 'src/components/RegisterCTA'
import path from 'src/constants/path'

const PHONE = '0867173946'
const ZALO = '0867173946'
const EMAIL = 'support@miniapp.vn'

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
  const [showConsult, setShowConsult] = useState(false)
  const [consulted, setConsulted] = useState(false)

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // no-op
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowConsult(false)
    }
    if (showConsult) document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showConsult])

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
            <p className='text-xl font-semibold text-gray-800 mb-6'>Giải pháp kinh doanh toàn diện cho doanh nghiệp</p>

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

              <button
                onClick={() => {
                  setConsulted(false)
                  setShowConsult(true)
                }}
                className='border border-orange-500 text-orange-500 px-6 py-3 rounded-md font-semibold hover:bg-orange-100 transition'
                aria-label='Liên hệ tư vấn ngay'
              >
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
            <img src={HeroImage} alt='Hero MiniApp' className='w-[572px] h-[428px] mt-4' />
          </motion.div>
        </div>
      </section>

      <section className='bg-[#FFF7F0] py-16'>
        <div className='max-w-7xl mx-auto px-6'>
          <h2 className='mb-10 text-center text-3xl font-bold text-gray-900 md:text-4xl'>
            Mini App là gì? <span className='text-black/80'>Sức mạnh từ sự kết hợp</span>
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
                className='rounded-xl bg-orange-200 p-6 shadow-sm transition hover:shadow-md'
              >
                <h3 className='mb-3 text-center text-2xl font-bold text-black'>{feature.title}</h3>
                <p className='text-justify text-xl leading-normal text-gray-700'>{feature.description}</p>
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

      {/* MODAL LIÊN HỆ TƯ VẤN */}
      <AnimatePresence>
        {showConsult && (
          <motion.div
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className='absolute inset-0 bg-black/40' onClick={() => setShowConsult(false)} />

            <motion.div
              role='dialog'
              aria-modal='true'
              className='relative z-10 w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-xl'
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 15, opacity: 0 }}
            >
              <div className='mb-4 flex items-center justify-between'>
                <h3 className='text-xl font-semibold'>{consulted ? 'Cảm ơn bạn đã liên hệ!' : 'Liên hệ tư vấn'}</h3>
                <button
                  onClick={() => setShowConsult(false)}
                  className='rounded-full px-2 py-1 text-xl leading-none hover:bg-gray-100'
                  aria-label='Đóng'
                >
                  ×
                </button>
              </div>

              {!consulted ? (
                <>
                  <p className='text-sm text-gray-600'>
                    Gọi/Zalo trực tiếp, chuẩn bị vài thông tin bên dưới để tư vấn nhanh hơn nhé.
                  </p>

                  <div className='mt-4 grid gap-3 md:grid-cols-3'>
                    <div className='rounded-xl border p-4'>
                      <div className='text-xs uppercase text-gray-500 font-semibold'>Điện thoại</div>
                      <div className='mt-1 text-lg font-semibold'>{PHONE}</div>
                      <div className='mt-3 flex gap-2'>
                        <a
                          href={`tel:${PHONE.replace(/\s/g, '')}`}
                          className='rounded-lg bg-orange-500 px-3 py-2 text-sm text-white hover:bg-orange-600'
                        >
                          Gọi ngay
                        </a>
                        <button
                          onClick={() => copy(PHONE)}
                          className='rounded-lg border px-3 py-2 text-sm hover:bg-gray-50'
                        >
                          Sao chép
                        </button>
                      </div>
                    </div>

                    <div className='rounded-xl border p-4'>
                      <div className='text-xs uppercase text-gray-500 font-semibold'>Zalo</div>
                      <div className='mt-1 text-lg font-semibold'>{ZALO}</div>
                      <div className='mt-3 flex gap-2'>
                        <a
                          href={`https://zalo.me/${ZALO.replace(/\D/g, '')}`}
                          target='_blank'
                          rel='noreferrer'
                          className='rounded-lg bg-sky-500 px-3 py-2 text-sm text-white hover:bg-sky-600'
                        >
                          Nhắn Zalo
                        </a>
                        <button
                          onClick={() => copy(ZALO)}
                          className='rounded-lg border px-3 py-2 text-sm hover:bg-gray-50'
                        >
                          Sao chép
                        </button>
                      </div>
                    </div>

                    <div className='rounded-xl border p-4'>
                      <div className='text-xs uppercase text-gray-500 font-semibold'>Email</div>
                      <div className='mt-1 text-lg font-semibold'>{EMAIL}</div>
                      <div className='mt-3 flex gap-2'>
                        <a
                          href={`mailto:${EMAIL}`}
                          className='rounded-lg bg-gray-900 px-3 py-2 text-sm text-white hover:bg-black/80'
                        >
                          Gửi email
                        </a>
                        <button
                          onClick={() => copy(EMAIL)}
                          className='rounded-lg border px-3 py-2 text-sm hover:bg-gray-50'
                        >
                          Sao chép
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 rounded-xl bg-gray-50 p-4'>
                    <div className='text-sm font-semibold'>Thông tin nên chuẩn bị khi gọi</div>
                    <ul className='mt-2 grid gap-2 md:grid-cols-2 text-sm text-gray-700'>
                      <li>• Lĩnh vực/Ngành nghề</li>
                      <li>• Mục tiêu/ý tưởng chính của miniapp</li>
                      <li>• Tính năng ưu tiên (đặt lịch, loyalty, thanh toán…)</li>
                      <li>• Kinh phí dự kiến & mốc thời gian</li>
                      <li>• Tên công ty/brand & Zalo OA (nếu có)</li>
                    </ul>
                  </div>

                  <div className='mt-6 flex flex-wrap gap-3'>
                    <button
                      onClick={() => setConsulted(true)}
                      className='rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700'
                    >
                      Tôi đã liên hệ xong
                    </button>
                    <button
                      onClick={() => setShowConsult(false)}
                      className='rounded-lg border px-4 py-2 text-sm hover:bg-gray-50'
                    >
                      Đóng
                    </button>
                  </div>
                </>
              ) : (
                <div className='text-center'>
                  <div className='mx-auto mb-2 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-2xl text-emerald-600'>
                    ✓
                  </div>
                  <p className='text-sm text-gray-600'>
                    Sau khi trao đổi thành công với nhân viên, vui lòng đăng ký thông tin để chúng tôi tạo tài khoản dự
                    án cho bạn.
                  </p>
                  <div className='mt-4 flex justify-center gap-3'>
                    <Link
                      to={path.register}
                      className='bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition'
                    >
                      Đăng ký thông tin
                    </Link>
                    <button
                      onClick={() => setShowConsult(false)}
                      className='rounded-lg border px-4 py-2 text-sm hover:bg-gray-50'
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
