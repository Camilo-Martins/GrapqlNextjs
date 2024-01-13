import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import { setContext } from "@apollo/client/link/context";
import fetch from "node-fetch";

const httpLink = createHttpLink({
  uri: "http://localhost:4000/",
  fetch: fetch as any,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  const newHaders = {
    ...headers,
    authorization: token ? `Bearer ${token}` : "",
  };

  return {
    headers: {
      newHaders,
    },
  };
});

export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: httpLink.concat(authLink),
  });
});
