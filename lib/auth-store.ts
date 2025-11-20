import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

// Static credentials (in production, this should be handled server-side)
const VALID_CREDENTIALS = {
  username: 'inventoyadmin',
  password: 'inventory@123'
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      username: null,
      
      login: (username: string, password: string) => {
        if (username === VALID_CREDENTIALS.username && password === VALID_CREDENTIALS.password) {
          set({ isAuthenticated: true, username })
          return true
        }
        return false
      },
      
      logout: () => {
        set({ isAuthenticated: false, username: null })
      }
    }),
    {
      name: 'auth-storage', // unique name for localStorage key
    }
  )
)