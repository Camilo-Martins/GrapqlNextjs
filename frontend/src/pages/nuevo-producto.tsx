"use client";
import Layout from "@/components/Layout";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import React, { FormEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import useToken from "@/hooks/useToken";
import Error from "@/components/Error";
import { CREAR_PRODUCTO, OBTENER_PRODUCTOS } from "@/graphql/queries.products";

const page = () => {
  //TODO: pasar formulario a un componente de ui
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const [createProduct] = useMutation(CREAR_PRODUCTO, {
    update(cache, { data: { createProduct } }) {
      const getCache: any = cache.readQuery({ query: OBTENER_PRODUCTOS });

      if (getCache) {
        cache.writeQuery({
          query: OBTENER_PRODUCTOS,
          data: {
            getProducts: [...getCache.getProducts, createProduct],
          },
        });
      }
    },
  });

  const { isLoading } = useToken();
  if (isLoading) {
    return;
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ([name, price, stock].includes("")) {
      setMessage("Debe incluir los campos");
      return;
    }

    const priceNumber = parseFloat(price)
    const stockNumber = parseInt(stock)

    try {
     await createProduct({
        variables: {
          input: {
            name,
            stock: stockNumber  ,
            price: priceNumber ,
           
         
          },
        },
      });
    
      setTimeout(() => {
        return router.push("/productos");
      }, 500);
    } catch (error: any) {
      console.log(error);
    }
  };

  setTimeout(() => {
    setMessage("");
  }, 2000);

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
