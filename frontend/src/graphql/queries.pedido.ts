import { gql } from "@apollo/client";

const NUEVO_PEDIDO = gql`
mutation Mutation($input: OrderInput) {
    newOrder(input: $input) {
      id
    }
  }
`


const OBTENER_ORDENES = gql`
query GetOrdersBySeller {
  getOrdersBySeller {
    id
    order {
      id
      name
      cantidad
      price
    }
    total
    client {
      name
      lastName
      id
      email
    }
    seller
    create
    state
  }
}
`

export {    NUEVO_PEDIDO, OBTENER_ORDENES}