import { gql } from "@apollo/client";

const   OBTENER_PRODUCTOS = gql`
query GetProducts {
    getProducts {
      id
      name
      stock
      price
    }
  }`

const CREAR_PRODUCTO = gql`
mutation Mutation($input: ProductInput) {
  createProduct(input: $input) {
   
    name
    stock
    price
 
  }
}`

const ELIMINAR_PRODUCTO= gql`
mutation Mutation($deleteProductId: ID!) {
  deleteProduct(id: $deleteProductId)
}
`

export {OBTENER_PRODUCTOS, CREAR_PRODUCTO, ELIMINAR_PRODUCTO}