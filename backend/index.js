const { ApolloServer } = require("apollo-server");
const typeDefs = require("./db/schema");
const resolvers = require("./db/resolvers");
const conectarDB = require("./config/db");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

conectarDB();

//Servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    let token;
    token = req.headers["authorization"];

    if (token) {
      if(token.startsWith('Bearer')){
        token = req.headers["authorization"].split(' ')[1] || "";
      }
     

      try {
        const user = jwt.verify(
         
          token,
          process.env.SECRET
        );
       
        return {
          user,
        };
      } catch (error) {
        console.log(error);
      }
    }else{
      console.log("esto no debe pasar")
    }
  },
});

//Arrancar servidor
server.listen().then(({ url }) => {
  console.log(`Servidor listo en la URL ${url}`);
});
