import partnersBanner from 'src/assets/images/partners-banner.png'
import mockup1 from 'src/assets/images/mockup1.png'
import mockup2 from 'src/assets/images/mockup2.png'
import { FaQuoteLeft } from 'react-icons/fa'
import CustomerSay from 'src/components/CustomerSay'
import RegisterCTA from 'src/components/RegisterCTA'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'

export default function Partners() {
  return (
    <>
      <Helmet>
        <title>MiniApp Web | Đối tác</title>
        <meta
          name='description'
          content='Khám phá cách MiniApp đã giúp các nghệ nhân và doanh nhân biến đam mê thành thu nhập ổn định. Tạo trải nghiệm di động mượt mà và hấp dẫn cho người dùng của bạn ngay hôm nay!'
        />
      </Helmet>
      <section className='relative bg-white pb-10 overflow-hidden'>
        <div className='relative w-full h-[560px] overflow-hidden'>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className='w-full h-full bg-cover bg-center relative z-10 flex items-center justify-center'
            style={{
              backgroundImage: `url(${partnersBanner})`,
              clipPath: 'polygon(0 0, 100% 0, 100% 87%, 90% 93%, 70% 97%, 50% 99%, 30% 97%, 10% 93%, 0 87%)'
            }}
          >
            <div className='absolute inset-0 bg-black/30 z-20'></div>
            <h2 className='text-white text-xl md:text-2xl lg:text-4xl font-bold z-30'>Khách hàng của chúng tôi</h2>
          </motion.div>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className='bg-gradient-to-b from-[#f7f9fc] to-[#eef3f8] py-10 px-4'
      >
        <div className='max-w-3xl mx-auto'>
          <h3 className='text-xl md:text-2xl font-bold text-gray-800 mb-4'>Những người thổi hồn vào từng sản phẩm</h3>
          <div className='bg-white shadow-md rounded-2xl px-6 py-8 md:px-10 md:py-10'>
            <p className='text-gray-700 text-sm md:text-base leading-relaxed mb-4'>
              Họ không phải là doanh nhân thông thường. Họ là nghệ sĩ thủ công, những người chăm chút từng nét vẽ, từng
              mũi đan, từng giọt máu để tạo nên những sản phẩm mang dấu ấn cá nhân. Có người là hoạ sĩ vẽ tranh gỗ tại
              nhà, có người là tay làm gốm thủ công ở vùng quê, cũng có bạn trẻ đan vòng tay và bán online như cách để
              chia sẻ năng lượng tích cực. Họ có chung một điểm: khát khao biến đam mê thành thu nhập ổn định.
            </p>
            <p className='text-gray-700 text-sm md:text-base leading-relaxed'>
              Trước đây, họ dựa vào mạng xã hội để quảng bá sản phẩm. Tuy nhiên, việc quản lý đơn hàng, trò chuyện với
              khách và tạo dựng thương hiệu cá nhân là bài toán khó. Họ cần một không gian riêng, đơn giản nhưng chuyên
              nghiệp để thể hiện mình — đó chính là lúc họ tìm đến MiniApp của SOD Solution.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className='bg-gradient-to-b from-[#fdfcfb] via-[#f9fbff] to-[#f5f8fc] py-10 px-4'
      >
        <div className='max-w-6xl mx-auto'>
          <h3 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-12'>
            SOD Solution đồng hành cùng họ để tạo ra MiniApp
          </h3>
          <div className='flex flex-col md:flex-row items-center justify-center gap-10 mb-12 '>
            <img src={mockup1} alt='MiniApp 1' className='w-[250px] md:w-[220px]' />
            <img src={mockup2} alt='MiniApp 2' className='w-[250px] md:w-[220px]' />
          </div>

          <div className='max-w-3xl mx-auto text-sm md:text-base text-gray-800 leading-relaxed'>
            <ul className='space-y-2 mb-6'>
              <li>✨ Giao diện độc quyền phù hợp với phong cách của từng nghệ nhân</li>
              <li>✨ Trang sản phẩm hiển thị sinh động, dễ tuỳ chỉnh</li>
              <li>✨ Tích hợp giỏ hàng, thanh toán online, và báo đơn hàng tự động</li>
              <li>✨ Kết nối trực tiếp với khách qua tính năng trò chuyện</li>
              <li>✨ Hỗ trợ thống kê doanh thu, quản lý khách hàng thân thiết</li>
            </ul>
            <p>
              Mỗi miniapp giống như một cửa hàng nhỏ xinh nằm ngay trong túi khách hàng — nơi mà nghệ nhân có thể kể câu
              chuyện về sản phẩm của mình một cách chân thật và cảm xúc nhất.
            </p>
          </div>
        </div>
      </motion.section>

      <section className='relative py-16 bg-gradient-to-br from-[#fcfcff] via-[#f9faff] to-[#eef5ff] px-6'>
        <div className='max-w-6xl mx-auto'>
          <h3 className='text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-16'>Nhận xét khách hàng</h3>

          <div className='grid md:grid-cols-3 gap-8'>
            {[
              {
                content:
                  'Tôi từng lo rằng mình không biết thiết kế, nhưng nhờ Mini App được tuỳ biến theo gu thẩm mỹ riêng, tôi có thể giới thiệu sản phẩm thủ công của mình một cách chỉn chu mà vẫn giữ chất nghệ.',
                author: '— Chị Trần Thị A, tiệm “Vòng Tay Mộc”'
              },
              {
                content:
                  'Mini App giúp tôi tạo gian hàng nhỏ trong điện thoại khách, đơn giản, đẹp, dễ dùng, nhưng cực kỳ chuyên nghiệp.',
                author: '— Anh Nam Handmade, Tranh gỗ decor'
              },
              {
                content:
                  'Tôi có thể theo dõi đơn hàng, nhắn với khách, và xây dựng thương hiệu cá nhân dễ dàng — mọi thứ gói gọn trong một Mini App.',
                author: '— Cô Hạnh, nghệ nhân macrame'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className='relative bg-white/60 backdrop-blur-md rounded-3xl shadow-md p-8 md:p-10 flex flex-col justify-between transition duration-300 hover:shadow-xl'
              >
                <FaQuoteLeft className='text-orange-400 text-3xl mb-4 opacity-60' />
                <p className='text-gray-800 text-base md:text-lg leading-relaxed mb-4'>{item.content}</p>
                <p className='text-sm font-semibold text-gray-700'>{item.author}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CustomerSay />
      <RegisterCTA />
    </>
  )
}
