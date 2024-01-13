"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Layout from "@/components/Layout";
import Title from "@/components/ui/Title";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";

import { useRouter, redirect } from "next/navigation";
import { INICIAR_SESION } from "@/graphql/queries";



const page = () => {
  const [isLoading, setIsloading] = useState<boolean>(true)
  let getToken: unknown;
 
  useEffect(() => {
       
  if (typeof window !== "undefined") {
    getToken = localStorage.getItem("token")
   
    }

    if(getToken){
      setIsloading(false)
      router.push("/clients")
   }

   if(!getToken){
    setIsloading(false)
   }
   console.log("ue", isLoading)
  }, [getToken])
  
  console.log(isLoading)

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [authUser] = useMutation(INICIAR_SESION);

  const router = useRouter();

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await authUser({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
      const token = data.authUser.token;
      //console.log(token)
      if(token){
        localStorage.setItem("token", token); 
      }

  setTimeout(() => {
        router.push("/clients")
      }, 3000); 

    } catch (error: any) {
      alert(error.message);
      console.log(error.message);
    }
  };
  return (
    <>
    {isLoading ? (
      <div className="w-full max-w-sm bg-white"></div>
    ) : (
      <>
      <Title>Login</Title>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-sm">
          <form
            onSubmit={handleLogin}
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
          >
            <div>
              <Label htmlFor="email">Correo</Label>
              <Input
                id="email"
                placeholder="correo@ejemplo.cl"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                placeholder="******"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                className=" bg-sky-600 w-full block py-2 mt-4 text-white uppercase font-bold
               hover:bg-sky-900
               "
                type="submit"
                value="Enviar"
              />
            </div>
          </form>
        </div>
      </div>
    </>
    )}

     
    </>
  );
};

export default page;
