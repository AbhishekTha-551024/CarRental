import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarOwner from '../../component/owner/NavbarOwner'
import Sidebar from '../../component/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Layout = ({ setShowLogin }) => {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return
    if (!user) {
      setShowLogin?.(true)
      navigate('/')
      return
    }
    if (user.role !== 'owner') {
      navigate('/')
    }
  }, [user, loading, setShowLogin, navigate])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }
  if (!user || user.role !== 'owner') {
    return null
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <NavbarOwner />

      {/* Main Section */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>

      </div>
     
    </div>
  )
}

export default Layout
