"use client";
import Layout from "@/components/Layout";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Title from "@/components/ui/Title";
import React, { FormEvent, useEffect, useState } from "react";
import { gql,  useMutation, useQuery } from "@apollo/client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { OBTENER_CLIENTE } from "@/graphql/queries";
import useToken from "@/hooks/useToken";
import { Cliente } from "@/interfaces/Cliente";
const NUEVO_CLIENTE = gql`
  mutation NewClient($input: ClientInput) {
    newClient(input: $input) {
    
      name
      lastName
      email
      company
      phone
     
    }
  }
`;

const OBTENER_UCLIENTE = gql`
query Query($getClientId: String) {
    getClient(id: $getClientId) {
      company
      create
      id
      email
      lastName
      name
      phone
    }
  }
`;

const ACTUALIZAR_CLIENTE = gql`
mutation Mutation($updateClientId: ID!, $input: ClientInput) {
  updateClient(id: $updateClientId, input: $input) {
    name
    lastName
    email
    phone
    company
  }
}
`;


const page = () => {
  const router = useParams();
  const route = useRouter();
  const {data, loading}  = useQuery(OBTENER_UCLIENTE,{
    variables:{
      getClientId : router?.id
    }
  });


  const [name, setName] = useState<string>("");
  const [lastName, setLastname] = useState<string>(data?.getClient?.lastName ? data?.getClient?.lastName : "");
  const [email, setEmail] = useState<string>(data?.getClient?.email ? data?.getClient?.email : "");
  const [company, setCompany] = useState<string>(data?.getClient?.company ? data?.getClient?.company : "");
  const [phone, setPhone] = useState<string>(data?.getClient?.phone ? data?.getClient?.phone : "");
  const [message, setMessage] = useState<string>("");
  
  useEffect(() => {
    setName(data?.getClient?.name)
    setLastname(data?.getClient?.lastName)
      setEmail(data?.getClient?.email)
      setPhone(data?.getClient?.phone)
    setCompany(data?.getClient?.company)
  }, [loading])
  


  const [updateClient]  = useMutation(ACTUALIZAR_CLIENTE,{
    update(cache, {data: {updateClient}}){

      

        cache.writeQuery({
          query: OBTENER_UCLIENTE,
          variables:{
            getClientId: router?.id
          },
          data:{
            getClient : updateClient
          }
        })

      }
  })

  const {isLoading} = useToken();
  if(isLoading){
    return;
  }




  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
    
      await updateClient({
        variables: {
          updateClientId: router?.id,
          input: {
            name,
            lastName,
            email,
            company,
            phone,
          },
        },
      });
     
      setTimeout(() => {
       route.push("/clientes");
      }, 500);

    } catch (error: any) {
      setMessage(error);
   
    }
  };

  return (
    <>
      <Layout>
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-lg">
          <h5 className="text-center py-3 uppercase font-semibold border-b-2 border-t-2 border-black"> Editar cliente</h5>
            <form
              onSubmit={handleLogin}
              className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 mt-6"
            >
              
              {message && <h1>El cliente ya esta axignado a este proveedor</h1>}
              <div className="flex flex-row justify-between ">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    placeholder={data?.getClient?.name}
                    name="nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    placeholder={data?.getClient?.lastName}
                    name="apellido"
                    value={lastName}
                    onChange={(e) => setLastname(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="juancarloslechuta@guemail.cl"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="compa">Compañía</Label>
                <Input
                  id="compa"
                  placeholder="31 minutos"
                  name="compa"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contacto">Contacto</Label>
                <Input
                  id="contacto"
                  placeholder="+56912345678"
                  name="contacto"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Input
                className="w-full block mt-5 bg-blue-700 hover:bg-blue-900 text-white uppercase px-2 py-2 rounded
               font-bold"
                type="submit"
                value="Agregar cliente"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default page;
