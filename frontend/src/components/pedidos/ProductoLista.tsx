import { PedidoContext } from "@/context/pedidos/PedidoContext";
import { Producto } from "@/interfaces/Producto";
import React, { useContext, useEffect, useState } from "react";

interface Props {
  producto: Producto;
}

const ProductoLista: React.FC<Props> = ({ producto }: Props) => {
  const [cantidad, setCantidad] = useState<number>(0);
  const { cantidadProductos, actualizarTotal } = useContext(PedidoContext);

  useEffect(() => {
    handleActualizarCantidad();
    actualizarTotal();
  }, [cantidad]);

  const handleActualizarCantidad = () => {
    const nuevoProducto = { ...producto, cantidad: Number(cantidad) };
    cantidadProductos(nuevoProducto);
  };

  return (
    <div className="flex shadow justify-between bg-white my-3 py-3 pl-5 border-l-8 border-sky-800 align-middle">
      <h1 className=" text-black uppercase" key={producto.id}>
        {producto.name} - ${producto.price}
      </h1>
      <input
        type="number"
        placeholder="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(Number(e.target.value))}
        onClick={() => handleActualizarCantidad()}
        className={`text-right font-bold ${cantidad > producto.stock ? "text-red-700  uppercase" : "text-black uppercase"}`}
      />
    </div>
  );
};

export default ProductoLista;
