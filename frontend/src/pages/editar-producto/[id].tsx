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
import Error from "@/components/Error";
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

const OBTENER_PRODUCTO = gql`
query GetProduct($getProductId: String!) {
  getProduct(id: $getProductId) {
    id
    name
    stock
    price
  }
}
`;

const ACTUALIZAR_PRODUCTO = gql`
mutation Mutation($updateProductId: ID!, $input: ProductInput) {
  updateProduct(id: $updateProductId, input: $input) {
    name
    price
    stock
  }
}
`;


const page = () => {
  const router = useParams();
  const route = useRouter();
  const {data, loading}  = useQuery(OBTENER_PRODUCTO,{
    variables:{
      getProductId : router?.id
    }
  });


 

  const [name, setName] = useState<string>( data?.getProduct?.name? data?.getProduct?.name : "");
  const [price, setPrice] = useState<string>( data?.getProduct?.price ? data?.getProduct?.price : "");
  const [stock, setStock] = useState<string>(data?.getProduct?.stock ? data?.getProduct?.stock : "");
  const [message, setMessage] = useState<string>("");
  
  useEffect(() => {
    setName(data?.getProduct?.name)
    setPrice(data?.getProduct?.price)
      setStock(data?.getProduct?.stock)
  }, [loading])
  


  const [updateProduct]  = useMutation(ACTUALIZAR_PRODUCTO,{
    update(cache, {data: {updateProduct}}){

      

        cache.writeQuery({
          query: OBTENER_PRODUCTO,
          variables:{
            getProductId: router?.id
          },
          data:{
            getProduct :  updateProduct
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



    const priceNumber = parseFloat(price)
    const stockNumber = parseInt(stock)

  

    try {
    
      await updateProduct({
        variables: {
          updateProductId: router?.id,
          input: {
            name,
            stock : stockNumber,
            price: priceNumber
           
          },
        },
      });
     
      setTimeout(() => {
       route.push("/productos");
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
            <h5 className="text-center py-3 uppercase font-semibold border-b-2 border-t-2 border-black">
              {" "}
              Agrega un nuevo producto
            </h5>
            <form
              onSubmit={handleLogin}
              className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 mt-6"
            >
              {message && <Error isError={true} message={message} />}
              <div className="flex flex-row justify-between ">
                <div>
                  <Label htmlFor="nombre">Nombre producto</Label>
                  <Input
                    id="nombre"
                    placeholder="Juan Carlos"
                    name="nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="apellido">Precio</Label>
                  <Input
                    id="apellido"
                    placeholder="Lechuga"
                    name="apellido"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Cantidad</Label>
                <Input
                  id="email"
                  placeholder="juancarloslechuta@guemail.cl"
                  name="email"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
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
