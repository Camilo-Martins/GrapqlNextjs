import Layout from "@/components/Layout";
import useToken from "@/hooks/useToken";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect } from "react";


const MEJORES_VENDEDORES = gql`
query GetBestSeller {
  getBestSeller {
    seller {
      name
      lastName
    }
    total
  }
}
`



const page = () =>{

    const {isLoading} = useToken();

    const {data, loading, startPolling, stopPolling} = useQuery(MEJORES_VENDEDORES);

  useEffect(() => {
    startPolling(1000)
    return () =>{
      stopPolling();
    }

  }, [startPolling, stopPolling])
  


    const vendedorGrafica = [];

   data?.getBestSeller.map((vendedor, index ) => {
    vendedorGrafica[index] = {
      ...vendedor?.seller[0],
      total: vendedor.total
    }
   })


   console.log(vendedorGrafica)


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

