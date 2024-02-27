"use client";
import Layout from "@/components/Layout";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import React, { FormEvent, useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { OBTENER_CLIENTE } from "@/graphql/queries";
import useToken from "@/hooks/useToken";
import { NUEVO_CLIENTE } from "@/graphql/queries";
import Error from "@/components/Error";

const page = () => {
  //TODO: pasar formulario a un componente de ui
  const [name, setName] = useState<string>("");
  const [lastName, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const [newClient] = useMutation(NUEVO_CLIENTE, {
    update(cache, { data: { newClient } }) {
      const getCache: any = cache.readQuery({ query: OBTENER_CLIENTE });

      if (getCache) {
        cache.writeQuery({
          query: OBTENER_CLIENTE,
          data: {
            getClientsSeller: [...getCache.getClientsSeller, newClient],
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

    if ([name, lastName, email, company].includes("")) {
      setMessage("Debe incluir los campos");
      return;
    }

    try {
      await newClient({
        variables: {
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
        return router.push("/clientes");
      }, 500);
    } catch (error: any) {
      return;
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
              Agrega un nuevo cliente
            </h5>
            <form
              onSubmit={handleLogin}
              className="bg-white shadow-md px-8 pt-6 pb-8 mb-4 mt-6"
            >
              {message && <Error isError={true} message={message} />}
              <div className="flex flex-row justify-between ">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    placeholder="Juan Carlos"
                    name="nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    placeholder="Lechuga"
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
                <Label htmlFor="contacto">Contacto (Opcional)</Label>

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
