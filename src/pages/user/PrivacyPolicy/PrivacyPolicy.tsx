import { motion } from 'framer-motion'
import bannerImage from 'src/assets/images/privacy-banner.png'

export default function PrivacyPolicy() {
  return (
    <>
      <section
        className='relative w-full h-[420px] md:h-[900px] flex items-center justify-center text-white object-contain'
        style={{
          backgroundImage: `url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className='absolute inset-0 bg-black/5'></div>

        <motion.h1
          className='absolute top-[570px] right-[10px] -translate-x-1/2 text-3xl md:text-6xl font-bold text-white'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Chính sách bảo mật
        </motion.h1>
      </section>

      <section className='max-w-5xl mx-auto px-4 md:px-6 py-16 space-y-10 text-gray-800 leading-8 text-base'>
        <p>
          Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn khi truy cập và sử dụng website cung cấp dịch vụ Mini App
          của chúng tôi. Chính sách này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của
          bạn.
        </p>

        <div>
          <h2 className='text-orange-500 font-bold text-lg mb-2'>1. Thu thập thông tin</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Thông tin cá nhân (như họ tên, email, số điện thoại) khi bạn gửi liên hệ hoặc đăng ký dịch vụ.</li>
            <li>Thông tin kỹ thuật như địa chỉ IP, loại trình duyệt, hệ điều hành, thời gian truy cập, v.v.</li>
            <li>Dữ liệu từ cookies và công nghệ theo dõi tương tự.</li>
          </ul>
        </div>

        <div>
          <h2 className='text-orange-500 font-bold text-lg mb-2'>2. Mục đích sử dụng thông tin</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Phản hồi yêu cầu của khách hàng.</li>
            <li>Cải tiến chất lượng dịch vụ và trải nghiệm người dùng.</li>
            <li>Gửi thông tin cập nhật, khuyến mãi,...</li>
            <li>Phân tích lưu lượng truy cập và hành vi sử dụng website.</li>
          </ul>
        </div>

        <div>
          <h2 className='text-orange-500 font-bold text-lg mb-2'>3. Chia sẻ thông tin</h2>
          <p>
            Chúng tôi không bán, trao đổi hoặc chia sẻ thông tin cá nhân của bạn với bên thứ ba ngoại trừ các trường hợp
            sau:
          </p>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Khi có sự đồng ý của bạn.</li>
            <li>Khi cần thiết để cung cấp dịch vụ (ví dụ: đối tác kỹ thuật hỗ trợ bảo trì hệ thống).</li>
            <li>Khi có yêu cầu từ cơ quan pháp luật.</li>
          </ul>
        </div>

        <div>
          <h2 className='text-orange-500 font-bold text-lg mb-2'>4. Bảo mật thông tin</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>
              Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu cá nhân khỏi mất
              mát, truy cập trái phép hoặc rò rỉ.
            </li>
            <li>Các thông tin nhạy cảm (ví dụ: mật khẩu) được mã hóa và bảo vệ nghiêm ngặt.</li>
          </ul>
        </div>

        <div>
          <h2 className='text-orange-500 font-bold text-lg mb-2'>5. Chính sách về Cookie</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Ghi nhớ tùy chọn người dùng.</li>
            <li>Phân tích cách bạn sử dụng website.</li>
            <li>Cải thiện hiệu suất và nội dung website.</li>
          </ul>
        </div>

        <div>
          <h2 className='text-orange-500 font-bold text-lg mb-2'>6. Quyền của bạn</h2>
          <ul className='list-disc pl-5 space-y-1'>
            <li>Yêu cầu xem, sửa hoặc xóa thông tin cá nhân của mình.</li>
            <li>Rút lại sự đồng ý bất kỳ lúc nào.</li>
            <li>Kiếu nại với cơ quan quản lý nếu thông tin bị lạm dụng.</li>
          </ul>
        </div>

        <div>
          <h2 className='text-orange-500 font-bold text-lg mb-2'>7. Liên hệ</h2>
          <p>Nếu bạn có bất kỳ câu hỏi nào về chính sách bảo mật này, vui lòng liên hệ với chúng tôi qua:</p>
          <ul className='pl-5 mt-2 space-y-1 list-disc'>
            <li>Email: support@vietsunco.vn</li>
            <li>SĐT: 024 5678 5999</li>
            <li>Địa chỉ: Diamond Plaza, 34 Lê Duẩn, Bến Nghé, Quận 1, Hồ Chí Minh</li>
          </ul>
        </div>
      </section>
    </>
  )
}
