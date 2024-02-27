import Link from 'next/link'
import React, { LinkHTMLAttributes } from 'react'

interface Props  {
    name: string
    href: string
};

const NavButon = ({name, href} : Props) => {
  return (
    <Link
    className=" bg-sky-700 
    hover:bg-sky-900
    text-xl rounded-sm uppercase text-white px-2 py-1 my-1 inline-block font-bold"
    href={href}
    
  >
   {name}
  </Link>
  )
}

export default NavButon