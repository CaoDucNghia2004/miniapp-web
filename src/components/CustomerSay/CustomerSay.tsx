import { FaStar } from 'react-icons/fa'
import { motion } from 'framer-motion'
import customer1 from 'src/assets/images/avatar/customer1.jpg'
import customer2 from 'src/assets/images/avatar/customer2.jpg'
import customer3 from 'src/assets/images/avatar/customer3.jpg'
import customer4 from 'src/assets/images/avatar/customer4.jpg'
import customer5 from 'src/assets/images/avatar/customer5.jpg'
import customer6 from 'src/assets/images/avatar/customer6.jpg'

const feedbacks = [
  {
    title: 'Dịch vụ tận tâm',
    content:
      'Vietsunco đã giúp chúng tôi xây dựng website giới thiệu doanh nghiệp vô cùng chỉn chu. Đội ngũ phản hồi rất nhanh, hỗ trợ chỉnh sửa đến khi hài lòng.',
    name: 'Chị Hà',
    industry: 'Lĩnh vực mỹ phẩm cao cấp',
    avatar: customer2
  },
  {
    title: 'Rất đáng tin cậy',
    content:
      'Chúng tôi hợp tác với Vietsunco cho dự án thiết kế MiniApp bán hàng nội bộ. Không chỉ đúng tiến độ mà UI/UX cực kỳ dễ dùng.',
    name: 'Anh Minh',
    industry: 'Ngành hàng tiêu dùng',
    avatar: customer1
  },
  {
    title: 'Thiết kế đẹp và tối ưu',
    content:
      'Chúng tôi được tư vấn từ đầu đến cuối rất rõ ràng. App chạy mượt, khách hàng nội bộ sử dụng rất thích. Cảm ơn đội ngũ!',
    name: 'Anh Dũng',
    industry: 'Thiết bị điện gia dụng',
    avatar: customer3
  },
  {
    title: 'Triển khai nhanh chóng',
    content:
      'Chúng tôi bất ngờ với tốc độ triển khai MiniApp của Vietsunco. Chỉ trong vài tuần là có thể chạy thử nghiệm. Một đối tác rất linh hoạt.',
    name: 'Chị An',
    industry: 'Thời trang và phụ kiện',
    avatar: customer4
  },
  {
    title: 'Tư vấn chuyên sâu',
    content:
      'Đội ngũ không chỉ thiết kế mà còn định hướng công nghệ, giúp chúng tôi tiết kiệm thời gian và chi phí triển khai. Một sự đầu tư xứng đáng.',
    name: 'Anh Long',
    industry: 'Sản xuất hàng thủ công',
    avatar: customer6
  },
  {
    title: 'Uy tín và hiệu quả',
    content:
      'Sau khi dùng MiniApp, chúng tôi nhận được phản hồi tích cực từ khách hàng. Giao diện tinh gọn, thương hiệu được truyền tải tốt.',
    name: 'Chị My',
    industry: 'Truyền thông và nội dung số',
    avatar: customer5
  }
]

export default function CustomerSay() {
  return (
    <section className='bg-sky-50 py-20'>
      <div className='max-w-7xl mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center mb-4'>KHÁCH HÀNG NÓI GÌ VỀ VIETSUNCO</h2>
        <p className='text-center text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed'>
          Cảm ơn tất cả khách hàng đã luôn tin tưởng và đồng hành cùng VIETSUNCO. Chúng tôi cam kết tiếp tục cải tiến và
          đồng hành cùng doanh nghiệp Việt.
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
          {feedbacks.map((fb, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true, amount: 0.2 }}
              className='bg-white p-6 rounded-xl shadow hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full'
            >
              <div>
                <h3 className='text-lg font-semibold mb-2'>{fb.title}</h3>
                <div className='flex text-yellow-400 mb-2 gap-1'>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <FaStar key={i} className='h-4 w-4' />
                    ))}
                </div>
                <p className='text-sm text-gray-700 mb-6'>{fb.content}</p>
              </div>

              <div className='flex items-center gap-3 mt-auto'>
                <div className='w-10 h-10 rounded-full overflow-hidden border'>
                  <img src={fb.avatar} alt={fb.name} className='w-full h-full object-cover' />
                </div>
                <div>
                  <p className='text-sm font-semibold'>{fb.name}</p>
                  <p className='text-xs text-gray-500'>{fb.industry}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
