"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useToken = () => {
  const [isAuth, setIsAuth] = useState(false);
  const router = useRouter();
  const [isLoading, setisLoading] = useState(true);

  let getToken: unknown;
  if (typeof window !== "undefined") {
    getToken = localStorage.getItem("token");
  }

  useEffect(() => {
    // Verifica si hay un token cuando el componente se monta
    if (!getToken) {
      // Si no hay token, redirige al usuario a la página "/about"
      router.push("/login");
    } else {
      // Si hay un token, marca el estado de carga como completado
      setisLoading(false);
    }
  }, [getToken, router]);

  return {
    isLoading,
    getToken,
    isAuth,
  };
};

export default useToken;
