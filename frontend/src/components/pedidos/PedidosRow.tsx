import { OBTENER_ORDENES } from "@/graphql/queries.pedido";
import { useQuery } from "@apollo/client";
import React, { cache, useEffect, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import Swal from "sweetalert2";

const ACTUALIZAR_PEDIDO = gql`
  mutation UpdateOrder($updateOrderId: ID!, $input: OrderInput) {
    updateOrder(id: $updateOrderId, input: $input) {
      state
    }
  }
`;

const ELIMINAR_PEDIDO = gql`
  mutation Mutation($deleteOrderId: ID!) {
    deleteOrder(id: $deleteOrderId)
  }
`;

const PedidosRow = ({ orders }: any) => {
  const { client } = orders;

  const [pedidoState, setPedidoState] = useState(orders?.state);
  const [isDetalle, setIsDetalle] = useState<boolean>(false);

  const [updateOrder] = useMutation(ACTUALIZAR_PEDIDO);
  const [deleteOrder] = useMutation(ELIMINAR_PEDIDO, {
    update(cache,data){
      const {getOrdersBySeller} : any = cache.readQuery({
        query: OBTENER_ORDENES
      })

      if(getOrdersBySeller){
        cache.writeQuery({
          query: OBTENER_ORDENES,
          data:{
            getOrdersBySeller: getOrdersBySeller.filter(
              order => order.id !== data.data.deleteOrder
            )
          }
        })
      }
    }

  

  });

  useEffect(() => {
    if (pedidoState) {
      setPedidoState(pedidoState);
    }
  }, [pedidoState]);

  const showDetalle = (id: string) => {
    if (id) {
      setIsDetalle(!isDetalle);
    }
  };

  const handleChangeState = async (estado: string) => {
    try {
      const { data } = await updateOrder({
        variables: {
          updateOrderId: orders?.id,
          input: {
            client: client.id,
            state: estado,
          },
        },
      });
      setPedidoState(data.updateOrder.state);
    } catch (error) {
      console.log(error);
    }
  };



  const handleEliminar = (id: string) =>{
  
    Swal.fire({
      title: "Eliminar",
      text: "No podrás revertir esta acción.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteOrder({
            variables: {
              deleteOrderId: id,
            },
          });

          Swal.fire({
            title: "Eliminado",
            icon: "success",
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  }


  return (
    <tr
      className="text-center hover:bg-sky-400 hover:text-white"
      key={orders?.id}
    >
      <td className="w-1/5 py-2 border">
        <div className="flex-row">
          <button
            onClick={() => handleEliminar(orders?.id)}
            className="rounded bg-red-900 px-3 py-1 mx-3 my-1 hover:bg-red-600 text-white uppercase font-bold"
          >
            X
          </button>
          <button className="rounded bg-green-900 px-3 py-1 mx-3 my-1 hover:bg-green-600 text-white uppercase font-bold">
            A
          </button>
        </div>
      </td>
      <td className="w-1/5 py-2 border">
        <div className="flex-row justify-start text-left pl-5">
          <p className=" font-semibold capitalize">
            Nombre: {orders?.client?.name} {orders?.client?.lastName}
          </p>
          <p className=" font-semibold">Correo: {orders?.client?.email}</p>
          <p className=" font-semibold capitalize">
            Telefono: {orders?.client?.phone ? orders?.client?.phone : "--"}
          </p>
        </div>
      </td>
      <td className="w-1/5 py-2 border">{orders?.seller}</td>
      <td className="w-1/5 py-2 border">
        <select
          className="bg-blue-900 
            text-center
        appearance-none text-white uppercase px-2 py-1 font-bold"
          value={pedidoState}
          onChange={(e) => handleChangeState(e.target.value)}
        >
          <option value="COMPLETADO">COMPLETADO</option>
          <option value="PENDIENTE">PENDIENTE</option>
          <option value="CANCELADO">CANCELADO</option>
        </select>
      </td>
      <td className="w-1/5 py-2 border">
        <button
          className=" bg-gray-600 hover:bg-gray-800 
         text-center
     appearance-none text-white uppercase px-2 py-1 font-bold"
          onClick={() => showDetalle(orders?.id)}
        >
          {isDetalle ? "Ocultar detalle" : "Ver detalle"}
        </button>
        {orders?.order.map((item) => (
          <div className=" text-left" key={item?.id}>
            {isDetalle && (
              <div className="flex-row justify-start text-left pl-5">
                <p className=" font-semibold capitalize">
                  Nombre: {item?.name}
                </p>
                <p className=" font-semibold capitalize">
                  Cantidad: {item?.cantidad}
                </p>
                <p className=" font-semibold capitalize">
                  Precio: {item?.price}
                </p>
              </div>
            )}
          </div>
        ))}
      </td>
      <td className="w-1/5 py-2 border">{orders?.total}</td>
    </tr>
  );
};

export default PedidosRow;
