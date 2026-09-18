import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

import {
  getCurrentUser,
  loginUser,
  registerMentor,
} from '../services/authService'

import {
  getToken,
  removeToken,
  saveToken,
} from '../storage/authStorage'

import {
  AUTH_EXPIRED_EVENT,
} from '../authEvents'

const AuthContext =
  createContext(null)

export function AuthProvider({
  children,
}) {

  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    const loadSession = async () => {

      const token = getToken()

      if (!token) {
        setLoading(false)
        return
      }

      try {

        const currentUser =
          await getCurrentUser()

        setUser(currentUser)

      } catch {

        removeToken()
        setUser(null)

      } finally {

        setLoading(false)
      }
    }

    loadSession()

  }, [])

  useEffect(() => {

    const handleExpiredSession = () => {
      setUser(null)
    }

    window.addEventListener(
      AUTH_EXPIRED_EVENT,
      handleExpiredSession,
    )

    return () => {

      window.removeEventListener(
        AUTH_EXPIRED_EVENT,
        handleExpiredSession,
      )
    }

  }, [])

  const login = async (
    email,
    password,
  ) => {

    const response =
      await loginUser(
        email,
        password,
      )

    saveToken(response.token)

    setUser(response.user)

    return response.user
  }

  const register = async (data) => {
    return registerMentor(data)
  }

  const logout = () => {

    removeToken()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: Boolean(user),
  }

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {

  const context =
    useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth debe utilizarse dentro de AuthProvider',
    )
  }

  return context
}