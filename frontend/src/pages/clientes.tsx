"use client";
import Layout from "@/components/Layout";
import Title from "@/components/ui/Title";
import { useQuery, useMutation } from "@apollo/client";
import { Cliente } from "@/interfaces/Cliente";
import { ELIMINAR_CLIENTE, OBTENER_CLIENTE } from "@/graphql/queries";
import Link from "next/link";
import useToken from "@/hooks/useToken";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import NavButon from "@/components/ui/NavButon";

const page = () => {
  const { data } = useQuery(OBTENER_CLIENTE);
  const router = useRouter();
  const [deleteClient] = useMutation(ELIMINAR_CLIENTE, {
    update(cache, data) {
      const { getClientsSeller }: Cliente | any = cache.readQuery({
        query: OBTENER_CLIENTE,
      });

      if (getClientsSeller) {
        cache.writeQuery({
          query: OBTENER_CLIENTE,
          data: {
            getClientsSeller: getClientsSeller.filter(
              (client: Cliente) => client.id !== data.data.deleteClient
            ),
          },
        });
      }
    },
  });

  const { isLoading } = useToken();

  if (isLoading) {
    return;
  }

  const handleElimiminar = (id: string) => {
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
          await deleteClient({
            variables: {
              deleteClientId: id,
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
  };

  const handleEditar = (id: string) => {
    router.push(`/editar-cliente/${id}`);
  };

  return (
    <>
      <Layout>
        <Title>Clientes</Title>
        <NavButon href={"/nuevo-cliente"} name="Nuevo cliente" />

        <table className="table-auto shadow-md w-full w-lg mt-5 hover:table-fixed">
          <thead className="bg-gray-800">
            <tr className="text-white uppercase">
              <th className="w-1/5 py-2">Nombre completo</th>
              <th className="w-1/5 py-2">Empresa</th>
              <th className="w-1/5 py-2">Email</th>
              <th className="w-1/5 py-2"> Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.getClientsSeller.map((client: Cliente) => (
              <tr
                className="text-center hover:bg-sky-400 hover:text-white"
                key={client?.id}
              >
                <td className="w-1/5 py-2 border">
                  {client?.name} {client?.lastName}
                </td>
                <td className="w-1/5 py-2 border">{client?.company}</td>
                <td className="w-1/5 py-2 border">{client?.email}</td>
                <td className="w-1/5 py-2 border">
                  <div className="flex-row">
                    <button
                      onClick={() => handleElimiminar(client?.id)}
                      className="rounded bg-red-900 px-3 py-1 mx-3 my-1 hover:bg-red-600 text-white uppercase font-bold"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => handleEditar(client?.id)}
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
    </>
  );
};

export default page;
