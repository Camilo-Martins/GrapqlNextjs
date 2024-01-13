"use client";
import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useRouter, redirect } from "next/navigation";
import { setTimeout } from "timers";
const OBTENER_USUARIO = gql`
  query GetToken {
    getToken {
      id
      name
      lastName
      email
      create
    }
  }
`;

const Header = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(OBTENER_USUARIO);
  console.log(data);

  //Protger antes de cargar
  if (loading) return "...";

    if(!data.getToken){
        router.push("/")
    }

  const hanldeCerrarSesion = () => {
   
      localStorage.removeItem("token");
     return router.push("/");
    
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="mr-2">
          Bienvenido, {data?.getToken?.name} {data?.getToken?.lastName}
        </h1>

        <button
          onClick={() => hanldeCerrarSesion()}
          className="bg-blue-600 w-full sm:w-auto text-white uppercase font-bold  rounded
            py-1 px-2 shadow-md hover:bg-blue-800"
          type="button"
        >
          Cerrar sesión
        </button>
      </div>
    </>
  );
};

export default Header;
