const { gql } = require("apollo-server");

//Schema
const typeDefs = gql`
  type User {
    id: ID
    name: String
    lastName: String
    email: String
    create: String
  }

  type Product {
    id: ID
    name: String
    stock: Int
    price: Float
  }

  type Client{
    id: ID
    name: String
    lastName: String
    email: String
    company: String
    phone: String
    create: String
  }

  type Token {
    token: String
  }

  type Order{
    id: ID
    order: [orderGroup]
    total: Float
    client: ID
    seller: ID
    create: String
    state: stateOrder
  }

  type orderGroup{
    id: ID
    quantity: Int
  }

  type topClients{
    total: Float
    client: [Client]
  }

  type topSeller{
    total: Float
    seller: [User]
  }

  input UserInput {
    name: String!
    lastName: String!
    email: String!
    password: String!
  }

  input AuthInput {
    email: String!
    password: String!
  }

  input ProductInput {
    name: String!
    stock: Int!
    price: Float!
  }

  input ClientInput {
    name: String!
    lastName: String!
    email: String!
    company: String!
    phone: String
  }

  input OrderProductInput{
    id: ID
    quantity: Int
  } 

  input OrderInput{
    order: [OrderProductInput]
    total: Float
    client: ID
    state: stateOrder
  }

  enum stateOrder{
    PENDIENTE
    COMPLETADO
    CANCELADO
  }

  type Query {
    #User
    getToken: User

    #Product
    getProducts: [Product]
    getProduct(id: String!): Product

    #Clients
    getClients: [Client]
    getClientsSeller: [Client]
    getClient (id: String): Client

    #Orders
    getOrders: [Order]
    getOrdersBySeller : [Order] 
    getOrder (id: String): Order
    getOrderByState (state: stateOrder): [Order] 

    #Search
    getBestClients: [topClients]
    getBestSeller: [topSeller]
    getProductsByName (text: String!): [Product]

  }

  type Mutation {
    #Users
    createUser(input: UserInput): User
    authUser(input: AuthInput): Token

    #Products
    createProduct(input: ProductInput): Product
    updateProduct(id: ID!, input: ProductInput): Product
    deleteProduct(id:ID!): String

    #Clients
    newClient (input: ClientInput): Client
    updateClient (id: ID!, input: ClientInput): Client
    deleteClient (id: ID!): String

    #Orders
    newOrder (input: OrderInput): Order
    updateOrder (id: ID!, input: OrderInput) : Order
    deleteOrder (id: ID!): String

  }
`;

module.exports = typeDefs;
