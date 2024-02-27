"use client";
import React, { useContext, useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@apollo/client";
import { OBTENER_CLIENTE } from "@/graphql/queries";
import { Cliente } from "@/interfaces/Cliente";
import useToken from "@/hooks/useToken";
import { PedidoContext, PedidoProvider } from "@/context/pedidos/PedidoContext";

const SelectCliente = () => {
  const { data } = useQuery(OBTENER_CLIENTE);
  const [cliente, SetCliente] = useState<Cliente[]>([]);

  const {agregarCliente} = useContext(PedidoContext)

    

  const selectCliente = (clientes: []) => {
    agregarCliente(clientes)
    SetCliente(clientes);
  
  };



  const { isLoading } = useToken();

  if (isLoading) {
    return;
  }

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-8 border-blue-600 text-gray-700 p-2 text-sm font-bold uppercase">
        1.- Asigna un cliente
      </p>
      <Select
        options={data?.getClientsSeller ? data?.getClientsSeller : []}
        onChange={(option: any) => selectCliente(option)}
        getOptionValue={(options) => options.id}
        getOptionLabel={(options) => options.name}
        placeholder="Seleccione cliente"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
};

export default SelectCliente;
