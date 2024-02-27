import Layout from "@/components/Layout";
import NavButon from "@/components/ui/NavButon";
import Title from "@/components/ui/Title";
import { ELIMINAR_PRODUCTO, OBTENER_PRODUCTOS } from "@/graphql/queries.products";
import useToken from "@/hooks/useToken";
import { Producto } from "@/interfaces/Producto";
import { useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import Swal from "sweetalert2";

const productos = () => {
  const { isLoading } = useToken();
  const {data} = useQuery(OBTENER_PRODUCTOS)
  const router =  useRouter();


    const [deleteProduct] = useMutation(ELIMINAR_PRODUCTO,{
      update(cache, data){


        console.log(data.data.deleteProduct)
        const { getProducts } : Producto | any = cache.readQuery({
          query: OBTENER_PRODUCTOS
        });

        if(getProducts){
          cache.writeQuery({
            query: OBTENER_PRODUCTOS,
            data:{
              getProducts: getProducts.filter(
                (producto : Producto) => producto.id !== data.data.deleteProduct
              )
            }
          })
        }

      }
    })

  if ( isLoading) {
    return;
  }


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
          await deleteProduct({
            variables: {
              deleteProductId: id,
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

  const handleEditar = (id: string) => {
    router.push(`/editar-producto/${id}`);
  };


  return (
    <Layout>
      <Title>Productos</Title>
      <NavButon
        href={"/nuevo-producto"}
        name="Agregar productos"
      />
       <table className="table-auto shadow-md w-full w-lg mt-5 hover:table-fixed">
          <thead className="bg-gray-800">
            <tr className="text-white uppercase">
              <th className="w-1/5 py-2">Nombre producto</th>
              <th className="w-1/5 py-2">precio</th>
              <th className="w-1/5 py-2">stock</th>
              <th className="w-1/5 py-2"> Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.getProducts.map((producto: Producto) => (
              <tr
                className="text-center hover:bg-sky-400 hover:text-white"
                key={producto?.id}
              >
                <td className="w-1/5 py-2 border">
                  {producto?.name} 
                </td>
                <td className="w-1/5 py-2 border">{producto?.price}</td>
                <td className="w-1/5 py-2 border">{producto?.stock}</td>
                <td className="w-1/5 py-2 border">
                  <div className="flex-row">
                    <button
                      onClick={() => handleEliminar(producto?.id)}
                      className="rounded bg-red-900 px-3 py-1 mx-3 my-1 hover:bg-red-600 text-white uppercase font-bold"
                    >
                      Eliminar
                    </button>
                    <button
                  onClick={() => handleEditar(producto?.id)}
                      className="rounded bg-green-900 px-3 py-1 mx-3 my-1 hover:bg-green-600 text-white uppercase font-bold"
                    >
                      editar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
    </Layout>
  );
};

export default productos;
