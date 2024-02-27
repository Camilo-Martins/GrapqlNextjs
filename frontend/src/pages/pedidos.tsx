import Layout from "@/components/Layout";
import PedidosRow from "@/components/pedidos/PedidosRow";
import NavButon from "@/components/ui/NavButon";
import Title from "@/components/ui/Title";
import { OBTENER_ORDENES } from "@/graphql/queries.pedido";

import useToken from "@/hooks/useToken";
import { useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import Swal from "sweetalert2";

const pedidos = () => {
  const { isLoading } = useToken();
  const [isDetalle, setIsDetalle] = useState<boolean>(false);

  //{orders?.state}
  const { data } = useQuery(OBTENER_ORDENES);


  if (isLoading) {
    return;
  } 
  
  return (
    <>
      <Layout>
        <Title>Pedidos</Title>
        <NavButon href={"/ingresar-pedido"} name="Ingresar pedido" />
        {data?.getOrdersBySeller?.length === 0 ? (
          <h1>No hay pedidos</h1>
        ) : (
          <table className="table-fixed shadow-md w-full w-lg mt-5 hover:table-fixed">
            <thead className="bg-gray-800">
              <tr className="text-white uppercase">
                <th className="w-1/5 py-2"></th>
                <th className="w-1/5 py-2">cliente</th>
                <th className="w-1/5 py-2">Vendedor</th>
                <th className="w-1/5 py-2">Estado</th>
                <th className="w-1/5 py-2">Detalle</th>
                <th className="w-1/5 py-2"> Total</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data?.getOrdersBySeller.map((orders) => (
                <PedidosRow
                  key={orders?.id}
                  orders={orders}
                />
              ))}
            </tbody>
          </table>
        )}
      </Layout>
    </>
  );
};

export default pedidos;
