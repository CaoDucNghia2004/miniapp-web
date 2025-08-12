import * as yup from 'yup'

const handleConfirmPassword = (refString: string) => {
  return yup
    .string()
    .required('Nhập lại password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự')
    .oneOf([yup.ref(refString)], 'Nhập lại password không khớp')
}

const VN_PHONE_REGEX = /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/

export const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Họ tên là bắt buộc')
    .min(2, 'Họ tên tối thiểu 2 ký tự')
    .max(50, 'Họ tên tối đa 50 ký tự'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không đúng định dạng')
    .min(5, 'Độ dài từ 5 - 160 ký tự')
    .max(160, 'Độ dài từ 5 - 100 ký tự'),
  phone: yup
    .string()
    .trim()
    .required('Số điện thoại là bắt buộc')
    .matches(VN_PHONE_REGEX, 'Số điện thoại không hợp lệ'),
  companyName: yup
    .string()
    .trim()
    .required('Tên công ty là bắt buộc')
    .min(2, 'Tên công ty tối thiểu 2 ký tự')
    .max(160, 'Tên công ty tối đa 160 ký tự'),
  companyAddress: yup
    .string()
    .trim()
    .required('Địa chỉ công ty là bắt buộc')
    .min(5, 'Địa chỉ tối thiểu 5 ký tự')
    .max(255, 'Địa chỉ tối đa 255 ký tự'),
  password: yup
    .string()
    .required('Password là bắt buộc')
    .min(6, 'Độ dài từ 6 - 160 ký tự')
    .max(160, 'Độ dài từ 6 - 160 ký tự'),
  confirm_password: handleConfirmPassword('password')
})

export type Schema = yup.InferType<typeof schema>
