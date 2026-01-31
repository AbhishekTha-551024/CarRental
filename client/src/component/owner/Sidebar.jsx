import React, { useState } from 'react'
import { assets, ownerMenuLinks } from '../../assets/assets'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { userApi } from '../../api'

const Sidebar = () => {
  const { user, fetchUser } = useAuth()
  const location = useLocation()
  const [localFile, setLocalFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [msg, setMsg] = useState('')

  const displaySrc = localFile ? URL.createObjectURL(localFile) : (user?.image || '')

  const handleSaveImage = async () => {
    if (!localFile) return
    setMsg('')
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('image', localFile)
      await userApi.uploadProfileImage(formData)
      await fetchUser()
      setLocalFile(null)
      setMsg('Saved')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setMsg(err.message || 'Upload failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteImage = async () => {
    if (!user?.image) return
    setMsg('')
    setDeleting(true)
    try {
      await userApi.deleteProfileImage()
      await fetchUser()
      setLocalFile(null)
      setMsg('Removed')
      setTimeout(() => setMsg(''), 2000)
    } catch (err) {
      setMsg(err.message || 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="w-64 min-h-screen bg-white border-r px-6 py-6 flex flex-col items-center">

      {/* Profile Image */}
      <div className="group relative w-28 h-28 flex-shrink-0">
        <label htmlFor="profile-image" className="cursor-pointer block w-full h-full">
          {displaySrc ? (
            <img
              src={displaySrc}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-2 border-gray-200 bg-teal-100 flex items-center justify-center text-teal-700 text-2xl font-semibold">
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
          )}
          <input
            type="file"
            id="profile-image"
            accept="image/*"
            hidden
            onChange={(e) => { setLocalFile(e.target.files?.[0] || null); setMsg(''); }}
          />
          <div className="absolute bottom-0 right-0 bg-gray-800 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow">
            <img src={assets.edit_icon} alt="Edit" className="w-4 h-4 brightness-0 invert" />
          </div>
        </label>
      </div>

      {msg && <p className="mt-2 text-xs text-center text-teal-600">{msg}</p>}

      <div className="mt-2 flex items-center gap-2">
        {localFile && (
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveImage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition disabled:opacity-50"
          >
            <img src={assets.check_icon} alt="" className="w-3.5 h-3.5 brightness-0 invert" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        )}
        {user?.image && (
          <button
            type="button"
            disabled={deleting || saving}
            onClick={handleDeleteImage}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition disabled:opacity-50"
            title="Remove profile photo"
          >
            <img src={assets.delete_icon} alt="" className="w-3.5 h-3.5" />
            {deleting ? '...' : 'Delete'}
          </button>
        )}
      </div>

      {/* User name */}
      <p className="mt-4 font-semibold text-gray-800">{user?.name}</p>

      {/* Menu links */}
      <div className="mt-8 w-full space-y-2">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition
              ${
                location.pathname === link.path
                  ? 'bg-teal-100 text-teal-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
          >
            <img
              src={
                location.pathname === link.path
                  ? link.coloredIcon
                  : link.icon
              }
              alt=""
              className="w-5 h-5"
            />
            <span className="text-sm font-medium">{link.name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
