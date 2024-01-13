"use client";
import React from 'react'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

const Sidebar = () => {


  //routing de router
  const router = usePathname();
  console.log(router);

  return (
    <aside className='bg-gray-800 sm:w-1/3 xl:w-1/5
      sm:min-h-screen p-5
    '>
      <div>
        <p className='
        text-white 
        font-bold
        text-2xl
        uppercase'>CRM Cliente</p>
      </div>
      <nav className='mt-5 list-none'>
        {/* TODO: MOVER a ui */}
        <li className={router ==="/clients" ? "bg-blue-600 p-1 rounded-xl" : "" }>
          <Link
          className='text-white font-bold mb-3 uppercase'
            href="/clients"
          >
              Clientes
          </Link>
        </li>
        <li className={router ==="/orders" ? "bg-blue-600 p-1 rounded-xl" : "" }>
          <Link
          className='text-white font-bold mb-3 uppercase'
            href="/orders"
          >
              Ordenes
          </Link>
        </li>
        <li className={router ==="/products" ? "bg-blue-600 p-1  rounded-xl" : "" }>
          <Link
          className='text-white font-bold mb-3 uppercase'
            href="/products"
          >
             Productos
          </Link>
        </li>
      </nav>
    </aside>
  )
}

export default Sidebar
