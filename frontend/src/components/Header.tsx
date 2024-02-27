"use client";
import React, { useEffect } from "react";
import { useQuery, gql, useSuspenseQuery } from "@apollo/client";
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
  const { data, error,  } = useSuspenseQuery(OBTENER_USUARIO);

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
