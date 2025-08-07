import { motion } from 'framer-motion'
import { PiSealCheckFill } from 'react-icons/pi'
import LoyaltyImg from 'src/assets/images/endow.png'
import EduImg from 'src/assets/images/education.png'
import HealthImg from 'src/assets/images/health.png'
import UtilityImg from 'src/assets/images/utility.png'
import FinanceImg from 'src/assets/images/finance.png'

const miniApps = [
  {
    title: 'MiniApp Bán hàng tích điểm',
    features: [
      'Tích điểm tự động trên mỗi đơn hàng, thiết lập chương trình quà tặng, ưu đãi',
      'Đặc quyền VIP như đặt hàng nhanh, hỗ trợ riêng, ưu tiên...'
    ],
    image: LoyaltyImg,
    imageSize: 'w-[350px] h-[350px]',
    tags: ['cửa hàng mỹ phẩm', 'thời trang', 'quán cà phê', 'siêu thị mini']
  },
  {
    title: 'MiniApp Giáo dục',
    features: [
      'Xem lịch học, lịch thi, nhận thông báo từ giảng viên',
      'Quản lý tiến độ học tập cá nhân, thanh toán online'
    ],
    image: EduImg,
    imageSize: 'w-[350px] h-[350px]',
    tags: ['trường đại học', 'trung tâm ngoại ngữ']
  },
  {
    title: 'MiniApp Sức khỏe',
    features: ['Đặt lịch khám, lấy số thứ tự online', 'Tư vấn với bác sĩ hoặc chatbot y tế, nhắc tái khám...'],
    image: HealthImg,
    imageSize: 'w-[400px] h-[400px]',
    tags: ['phòng khám', 'nha khoa', 'bệnh viện', 'spa']
  },
  {
    title: 'MiniApp Tiện ích',
    features: [
      'Quản lý hóa đơn điện - nước - dịch vụ, ghi chú cá nhân',
      'Thông báo cộng đồng, đăng ký dịch vụ sửa chữa'
    ],
    image: UtilityImg,
    imageSize: 'w-[430px] h-[300px]',
    tags: ['quản lý cá nhân', 'khu dân cư', 'tòa nhà văn phòng']
  },
  {
    title: 'MiniApp Tài chính',
    features: ['Quản lý giao dịch đơn giản, tích hợp ví điện tử', 'Thanh toán hóa đơn, đăng ký tư vấn khoản vay'],
    image: FinanceImg,
    imageSize: 'w-[300px] h-[350px]',
    tags: ['ngân hàng', 'công ty tài chính']
  }
]

export default function ServiceList() {
  return (
    <section className='bg-white py-16 bg-gradient-to-b from-[#fdfcfb] via-[#f7faff] to-[#edf6ff]'>
      <div className='max-w-5xl mx-auto px-6'>
        <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4'>
          Phát triển sản phẩm mang thương hiệu riêng
        </h2>
        <p className='text-center text-md text-gray-600 mb-10'>
          Chúng tôi cung cấp giải pháp linh hoạt cho từng ngành nghề cụ thể
        </p>

        <div className='space-y-1'>
          {miniApps.map((app, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              } items-center justify-between gap-x-10 mb-1`}
            >
              <div className='md:w-[350px] text-center md:text-left'>
                <h3 className='bg-blue-900 text-white text-base md:text-xl font-semibold px-5 py-2 rounded mb-5 w-full text-center'>
                  {app.title}
                </h3>
                <ul className='space-y-3 text-gray-800 text-sm md:text-base leading-relaxed'>
                  {app.features.map((line, i) => (
                    <li key={i} className='flex items-start gap-2 justify-center md:justify-start'>
                      <PiSealCheckFill className='text-blue-600 mt-1 text-base shrink-0' />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
                <p className='text-base text-gray-500 mt-4'>
                  🔹 Phù hợp cho: <span className='italic'>{app.tags.join(', ')}</span>
                </p>
              </div>

              <div className='md:w-1/2 flex justify-center'>
                <img src={app.image} alt={app.title} className={`object-contain rounded-md ${app.imageSize}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
