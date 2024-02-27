import Layout from "@/components/Layout";
import useToken from "@/hooks/useToken";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MEJORES_CLIENTES = gql`
query GetBestClients {
  getBestClients {
    total
    client {
      name
      lastName
    }
  }
}
`


const page = () =>{

  const {data, loading, startPolling, stopPolling} = useQuery(MEJORES_CLIENTES);
    const {isLoading} = useToken();

    useEffect(() => {
      startPolling(1000)
      return () =>{
        stopPolling();
      }
  
    }, [startPolling, stopPolling])

    const vendedorGrafica = [];

   data?.getBestClients.map((cliente, index ) => {
    vendedorGrafica[index] = {
      ...cliente?.client[0],
      total: cliente.total
    }
   })



    if(isLoading){
      return;
    }
  
  
    return (
     <>
      <Layout>
          <h1>Hola</h1>
          <BarChart
          className="mt-10"
          width={800}
          height={400}
          data={vendedorGrafica}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#82ca9d" activeBar={<Rectangle fill="gold" stroke="purple" />} />
        </BarChart>
      </Layout>
     </>
    )
}

export default page;

