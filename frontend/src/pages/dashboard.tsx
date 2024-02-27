"use client"
import Layout from '@/components/Layout'
import useToken from '@/hooks/useToken'
import React from 'react'

const dashboard = () => {
  
  const {isLoading} = useToken();

  if(isLoading){
    return;
  }


  return (
   <>
    <Layout>
        <h1>Hola</h1>
    </Layout>
   </>
  )
}

export default dashboard