import "@/styles/globals.css";
import { ApolloProvider } from "@apollo/client";
import type { AppProps } from "next/app";
import client from "./lib/client";
import { PedidoProvider } from "@/context/pedidos/PedidoContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider
      client={client}
    >
      <PedidoProvider>
      <Component {...pageProps} />
      </PedidoProvider>
     
  
    </ApolloProvider>
  )
}
