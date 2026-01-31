import React from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NavbarOwner = () => {
  const { user } = useAuth()
  return (
    <div>
      <Link to='/'>
        <img src={assets.logo} alt="" />
      </Link>
      <p>Welcome, {user?.name || 'Owner'}</p>
    </div>
  )
}

export default NavbarOwner
