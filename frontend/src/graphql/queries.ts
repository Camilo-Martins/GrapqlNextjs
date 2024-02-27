import { gql } from "@apollo/client";

const INICIAR_SESION = gql`
mutation Mutation($input: AuthInput) {
  authUser(input: $input) {
    token
  }
}
`;

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

const OBTENER_CLIENTE = gql`
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

const NUEVO_CLIENTE = gql`
  mutation NewClient($input: ClientInput) {
    newClient(input: $input) {
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

const ELIMINAR_CLIENTE = gql`
mutation DeleteClient($deleteClientId: ID!) {
  deleteClient(id: $deleteClientId)
}
`;


export {INICIAR_SESION , OBTENER_USUARIO, OBTENER_CLIENTE, NUEVO_CLIENTE, ELIMINAR_CLIENTE}