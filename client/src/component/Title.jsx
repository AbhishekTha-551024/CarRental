import React from 'react'

const Title = ({ title, subTitle, align }) => {
  return (
    <div className={`
      flex flex-col
      ${align === "left" ? "md:items-start md:text-left" : "md:items-center md:text-center"}
      items-center
      my-6
    `}>
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{title}</h1>
      <p className="text-gray-500 text-lg">{subTitle}</p>
    </div>
  )
}

export default Title
