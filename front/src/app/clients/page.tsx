"use client";
import Layout from "@/components/Layout";
import Title from "@/components/ui/Title";
import React, { useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import { gql, useQuery, useSuspenseQuery } from "@apollo/client";
import { Client } from "@/interfaces/client";

const query = gql`
  query getClientsSeller {
    getClientsSeller {
      id
      name
      lastName
      email
      company
      phone
      create
    }
  }
`;

const page = () => {
  const { data, error, loading } =  useQuery(query);
  const router = useRouter();
  if(!data?.getClientsSeller){
    return router.push("/")
  }

  return (
    <div>
      <Layout>
        <Title>Clientes</Title>
        <table className="table-auto shadow-md w-full w-lg mt-10">
          <thead className="bg-gray-800">
            <tr className="text-white">
              <th className="w-1/5 py-2">Nombre</th>
              <th className="w-1/5 py-2">Empresa</th>
              <th className="w-1/5 py-2">Email</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {data?.getClientsSeller.map((client: Client) => (
              <tr className="text-center" key={client.id}>
                <td className="w-1/5 py-2">{client.name}</td>
                <td className="w-1/5 py-2">{client.company}</td>
                <td className="w-1/5 py-2">{client.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Layout>
    </div>
  );
};

export default page;
