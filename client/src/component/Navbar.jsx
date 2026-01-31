import React, { useState } from 'react'
import { assets, menuLinks } from '../assets/assets'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ownerApi } from '../api'

const Navbar = ({ setShowLogin }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [becomingOwner, setBecomingOwner] = useState(false)
  const { user, logout, fetchUser } = useAuth()

  return (
    <nav className="sticky top-0 z-50 w-full px-4 sm:px-6 py-3 flex items-center justify-between bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <Link to="/" onClick={() => setOpen(false)} className="flex-shrink-0">
        <img src={assets.logo} alt="logo" className="h-8 transition-transform duration-200 hover:scale-105" />
      </Link>

      <div className="hidden sm:flex flex-1 justify-center items-center gap-8">
        {menuLinks.map((link, index) => (
          <Link
            key={index}
            to={link.path}
            onClick={() => setOpen(false)}
            className={`font-medium transition-colors duration-200 ${location.pathname === link.path ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="hidden sm:flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 bg-gray-50 focus-within:bg-white focus-within:border-teal-500 transition-colors">
          <img src={assets.search_icon} alt="search" className="h-4 opacity-60" />
          <input type="text" placeholder="Search cars" className="outline-none text-sm w-32 bg-transparent" />
        </div>
        {user?.role === 'owner' && (
          <button onClick={() => { setOpen(false); navigate('/owner') }} className="text-sm font-medium text-teal-600 hover:text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors">
            Dashboard
          </button>
        )}
        {user && user.role !== 'owner' && (
          <button
            type="button"
            disabled={becomingOwner}
            onClick={async () => {
              setBecomingOwner(true)
              try {
                await ownerApi.changeRole()
                await fetchUser()
                navigate('/owner/add-car')
              } catch {
                setBecomingOwner(false)
              }
            }}
            className="text-sm font-medium text-teal-600 hover:text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50"
          >
            {becomingOwner ? '...' : 'List your car'}
          </button>
        )}
        {user ? (
          <button onClick={() => logout()} className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            Logout
          </button>
        ) : (
          <button onClick={() => setShowLogin(true)} className="text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 px-4 py-1.5 rounded-lg transition-colors shadow-sm">
            Login
          </button>
        )}
      </div>

      <button type="button" aria-label="Menu" className="sm:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className="h-6" />
      </button>

      <div className={`fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white shadow-xl z-40 flex flex-col pt-16 px-6 pb-6 transform transition-transform duration-300 ease-out sm:hidden ${open ? "translate-x-0" : "translate-x-full"}`}>
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} onClick={() => setOpen(false)} className={`py-3 px-4 rounded-lg font-medium transition-colors ${location.pathname === link.path ? "bg-teal-50 text-teal-700" : "text-gray-700 hover:bg-gray-50"}`}>
            {link.name}
          </Link>
        ))}
        <div className="border-t border-gray-100 my-2" />
        {user?.role === 'owner' && <button onClick={() => { setOpen(false); navigate('/owner') }} className="py-3 px-4 rounded-lg font-medium text-teal-600 hover:bg-teal-50 text-left">Dashboard</button>}
        {user && user.role !== 'owner' && (
          <button type="button" disabled={becomingOwner} onClick={async () => { setOpen(false); setBecomingOwner(true); try { await ownerApi.changeRole(); await fetchUser(); navigate('/owner/add-car'); } catch { setBecomingOwner(false); } }} className="py-3 px-4 rounded-lg font-medium text-teal-600 hover:bg-teal-50 text-left disabled:opacity-50">
            {becomingOwner ? '...' : 'List your car'}
          </button>
        )}
        {user ? <button onClick={() => { setOpen(false); logout() }} className="py-3 px-4 rounded-lg font-medium text-gray-700 hover:bg-gray-50 text-left">Logout</button> : <button onClick={() => { setOpen(false); setShowLogin(true) }} className="py-3 px-4 rounded-lg font-medium text-white bg-teal-600 hover:bg-teal-700 text-left">Login</button>}
      </div>

      {open && <div className="fixed inset-0 bg-black/20 z-30 sm:hidden" onClick={() => setOpen(false)} aria-hidden />}
    </nav>
  )
}

export default Navbar
