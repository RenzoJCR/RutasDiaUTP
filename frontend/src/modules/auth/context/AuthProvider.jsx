import {
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

import { AuthContext } from './AuthContext'

function AuthProvider({
  children,
}) {

  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(() => Boolean(getToken()))

  useEffect(() => {

    const token = getToken()

    if (!token) {
      return undefined
    }

    let active = true

    getCurrentUser()
      .then((currentUser) => {

        if (active) {
          setUser(currentUser)
        }

      })
      .catch(() => {

        removeToken()

        if (active) {
          setUser(null)
        }

      })
      .finally(() => {

        if (active) {
          setLoading(false)
        }

      })

    return () => {
      active = false
    }

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

  const register =
    async (data) => {

      return registerMentor(data)
    }

  const refreshUser =
    async () => {

      const currentUser =
        await getCurrentUser()

      setUser(currentUser)

      return currentUser
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
    refreshUser,
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

export default AuthProvider