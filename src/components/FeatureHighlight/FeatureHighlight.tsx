import { motion } from 'framer-motion'
import { BsCheckCircleFill } from 'react-icons/bs'
import PaymentImg from 'src/assets/images/payment.png'
import CustomerImg from 'src/assets/images/customer.png'
import AIImg from 'src/assets/images/ai.png'
import DataImg from 'src/assets/images/data.png'

const features = [
  {
    title: 'Thanh toán trực tuyến',
    content: [
      'Tích hợp ví điện tử (MoMo, ZaloPay) và ngân hàng với tỷ lệ thành công 99%',
      'Mang lại sự tiện lợi tối đa cho khách hàng'
    ],
    image: PaymentImg,
    imageSize: 'w-[380px] h-[380px]'
  },
  {
    title: 'Quản lý khách hàng',
    content: [
      'Tích điểm, đổi quà và phân loại khách hàng tự động',
      'Giúp bạn xây dựng mối quan hệ bền chặt và tăng cường sự trung thành'
    ],
    image: CustomerImg,
    imageSize: 'w-[360px] h-[360px]'
  },
  {
    title: 'Tính năng AI',
    content: [
      'Tích hợp AI để cá nhân hóa trải nghiệm người dùng',
      'Đề xuất sản phẩm/dịch vụ thông minh và tự động hóa quy trình'
    ],
    image: AIImg,
    imageSize: 'w-[340px] h-[410px]'
  },
  {
    title: 'Phân tích dữ liệu',
    content: [
      'Cung cấp báo cáo chi tiết về hành vi người dùng và hiệu suất kinh doanh',
      'Giúp bạn đưa ra các chiến lược dựa trên dữ liệu'
    ],
    image: DataImg,
    imageSize: 'w-[310px] h-[360px]'
  }
]

export default function FeatureHighlight() {
  return (
    <section className='bg-white py-16 bg-gradient-to-b from-[#fdfcfb] via-[#f7faff] to-[#edf6ff]'>
      <div className='max-w-5xl mx-auto px-6'>
        <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-900 mb-2'>
          Các tính năng nổi bật có thể tích hợp
        </h2>
        <p className='text-center text-md text-gray-600 mb-10'>
          ...tự tin là đối tác tin cậy trong gia công app theo yêu cầu ở mọi lĩnh vực
        </p>

        <div className='space-y-10'>
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} items-center justify-between gap-x-10 mb-8`}
            >
              <div className='md:w-[350px]'>
                <h3 className='bg-blue-900 text-white text-base md:text-xl font-semibold px-5 py-2 rounded mb-5 w-full text-center'>
                  {feature.title}
                </h3>
                <ul className='space-y-3 text-gray-800 text-sm md:text-base leading-relaxed'>
                  {feature.content.map((line, i) => (
                    <li key={i} className='flex items-start gap-2'>
                      <BsCheckCircleFill className='text-green-500 mt-1 text-sm md:text-base shrink-0' />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='md:w-1/2 flex justify-center'>
                <img
                  src={feature.image}
                  alt={feature.title}
                  className={`object-contain rounded-md ${feature.imageSize}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
