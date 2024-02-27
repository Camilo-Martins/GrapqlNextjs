import { PedidoContext } from "@/context/pedidos/PedidoContext";
import { Producto } from "@/interfaces/Producto";
import React, { useContext, useEffect, useState } from "react";
import ProductoLista from "./ProductoLista";

const ResumenPedido = () => {
  const { productos, calcularTotal } = useContext(PedidoContext);


  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-8 border-yellow-400 text-gray-700 p-2 text-sm font-bold uppercase">
        3.- Ajustar cantidades
      </p>
      {productos.length > 0 ? (
        <>
          <p className="text-center border-b-2 border-black uppercase font-light pt-5">
            Productos en tu lista
          </p>
          {productos.map((producto: Producto) => (
           <ProductoLista
                 key={producto.id}
                producto={producto}
           />
          ))}
        </>
      ) : (
        <p>No hay productos disponibles</p>
      )}
    </>
  );
};

export default ResumenPedido;
