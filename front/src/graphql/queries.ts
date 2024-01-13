import { useMutation, gql } from "@apollo/client";

export const INICIAR_SESION = gql`
mutation Mutation($input: AuthInput) {
  authUser(input: $input) {
    token
  }
}
`;

export const OBTENER_CLIENTES = gql`
query GetClientsSeller {
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