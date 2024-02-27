/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import React, { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";

import { INICIAR_SESION } from "@/graphql/queries";

import Title from "@/components/ui/Title";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Error from "@/components/Error";

const login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [mesagge, setMessage] = useState<string>("");

  const router = useRouter();

  const [authUser] = useMutation(INICIAR_SESION);

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

      if (token) {
        localStorage.setItem("token", token);
      }

      setTimeout(() => {
        return router.push("/dashboard");
      }, 1000);
    } catch (error: any) {
      setMessage("Error con las credenciales");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };
  return (
    <>
      <div className=" flex justify-center bg-blue-950 min-h-screen align-middle pt-60">
        <div className="w-full max-w-sm">
          <form
            onSubmit={handleLogin}
            className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
          >
            <Title className="text-center font-bold uppercase text-4xl pb-5">
              Login
            </Title>
            {mesagge && <Error isError={true} message={mesagge} />}
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
  );
};

export default login;
