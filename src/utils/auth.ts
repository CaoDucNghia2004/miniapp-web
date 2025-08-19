import type { User } from 'src/types/user.type'

export const getAccessTokenFromLS = () => {
  return localStorage.getItem('access_token') || ''
}

export const setAccessTokenToLS = (access_token: string) => {
  return localStorage.setItem('access_token', access_token)
}

export const clearAccessTokenFromLS = () => {
  localStorage.removeItem('access_token')
}
export const clearProfileFromLS = () => {
  localStorage.removeItem('profile')
}

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
