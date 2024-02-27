import Layout from "@/components/Layout";
import CalcularTotal from "@/components/pedidos/CalcularTotal";
import ResumenPedido from "@/components/pedidos/ResumenPedido";
import SelectCliente from "@/components/pedidos/SelectCliente";
import SelectProduct from "@/components/pedidos/SelectProducto";
import NavButon from "@/components/ui/NavButon";
import Title from "@/components/ui/Title";
import { PedidoContext } from "@/context/pedidos/PedidoContext";
import { NUEVO_PEDIDO, OBTENER_ORDENES } from "@/graphql/queries.pedido";

import useToken from "@/hooks/useToken";
import { Producto } from "@/interfaces/Producto";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
const pedidos = () => {
  const { isLoading } = useToken();
  const { cliente, productos, total } = useContext(PedidoContext);
  const [alerta, setAlerta] = useState("");
  const router = useRouter();
  const [newOrder] = useMutation(NUEVO_PEDIDO,{
    update(cache, {data: {newOrder} }){
      const getCache: any = cache.readQuery({query: OBTENER_ORDENES});
    
      if(getCache){
        cache.writeQuery({
          query: OBTENER_ORDENES,
          data:{
            getOrdersBySeller: [...getCache.getOrdersBySeller, newOrder]
          }
        })
      }
    
    }
  });


  if (isLoading) {
    return;
  }

  const validarPedido = () => {
    return !productos.every(
      (producto: Producto) => (producto.cantidad ? producto.cantidad : 1) > 0
    ) ||
      total === 0 ||
      cliente.length === 0
      ? " opacity-50 cursor-not-allowed"
      : "";
  };

  const handleNewPedido = async () => {
    const { id } = cliente;

    //eliminar información adicional--
    const order = productos.map(
      ({ __typename, stock, ...producto }) => producto
    );

    console.log("order", order);

    productos.map((producto) => {
      if ((producto.cantidad ? producto.cantidad : 1) > producto.stock) {
        setAlerta("La cantidad es mayor al stock disponible");
      }
    });

    if (alerta) {
      return alert(alerta);
    }

    try {
      const { data } = await newOrder({
        variables: {
          input: {
            client: id,
            total,
            order,
          },
        },
      });
     
      setTimeout(() => {
        return router.push("/pedidos");
      }, 500);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Layout>
        <div className=" flex justify-center mt-5">
          <div className="w-full max-w-lg">
            <Title className="text-center uppercase text-4xl font-extralight">
              Ingresar pedido
            </Title>
            <SelectCliente />
            <SelectProduct />
            <ResumenPedido />
            <CalcularTotal />
            <button
              onClick={() => handleNewPedido()}
              className={`w-full bg-sky-600 py-3 mt-5 uppercase text-white font-bold text-xl
             hover:bg-sky-900 ${validarPedido()}
           `}
            >
              Ingresar pedido
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default pedidos;
