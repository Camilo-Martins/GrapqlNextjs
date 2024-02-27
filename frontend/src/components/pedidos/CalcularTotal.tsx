import { PedidoContext } from '@/context/pedidos/PedidoContext'
import React, { useContext } from 'react'

const CalcularTotal = () => {

  const {total} = useContext(PedidoContext);


    
  return (
    <>
     <p className="mt-10 my-2 bg-white border-l-8 border-blue-800 text-gray-700 p-2 text-sm font-bold uppercase">
        4.- Total Referencial
      </p>
      <div className='flex item-center mt-5 shadow justify-between p-3 bg-white border-solid border-2 border-gray-300'>
        <p className='uppercase text-gray-800 text-lg font-semibold'>total a pagar</p>
        <p className='text-gray-800 mt-0 font-semibold text-lg'> $ {total}</p>
      </div>
    </>
  )
}

export default CalcularTotal