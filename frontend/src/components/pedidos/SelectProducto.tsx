"use client";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@apollo/client";
import { Cliente } from "@/interfaces/Cliente";
import useToken from "@/hooks/useToken";
import { PedidoContext, PedidoProvider } from "@/context/pedidos/PedidoContext";
import { OBTENER_PRODUCTOS } from "@/graphql/queries.products";
import { Producto } from "@/interfaces/Producto";

const SelectProduct = () => {
  const { data } = useQuery(OBTENER_PRODUCTOS);
  const [producto, SetProducto] = useState<Producto[]>([]);

  const {agregarProductos } = useContext(PedidoContext)

    

  const selectProduct = (productos: []) => {
    agregarProductos(productos)
    SetProducto(productos)
  
  };

  console.log(producto)

  const { isLoading } = useToken();

  if (isLoading) {
    return;
  }

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-8 border-green-600 text-gray-700 p-2 text-sm font-bold uppercase">
        2.- Selecciona productos
      </p>
      <Select
        isMulti={true}
        options={data?.getProducts ? data?.getProducts : []}
        onChange={(option: any) => selectProduct(option)}
        getOptionValue={(options) => options.id}
        getOptionLabel={(options) => options.name}
        placeholder="Seleccione cliente"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
};

export default SelectProduct;
