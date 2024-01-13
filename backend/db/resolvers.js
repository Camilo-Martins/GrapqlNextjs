const bcryptjs = require("bcryptjs");
const User = require("../models/User");
const Product = require("../models/Product");
const Client = require("../models/Client");
const Order = require("../models/Order");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });
const mongoose = require("mongoose");

const crearToken = (user, word, exp) => {
  const { id, email, name, lastName } = user;
  return jwt.sign(
    {
      id,
      name,
      lastName,
      email,
    },
    word,
    {
      expiresIn: exp,
    }
  );
};

//Resolvers
const resolvers = {
  Query: {
    getToken: async (_, { }, ctx) => {
      
      
      return ctx.user;
    },
    getProducts: async (_, {}) => {
      try {
        const products = await Product.find();
        return products;
      } catch (error) {
        console.log(error);
      }
    },
    getProduct: async (_, { id }) => {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      console.log(isValid);

      if (!isValid) {
        throw new Error("ID no válido");
      }

      const product = await Product.findById(id);

      if (!product) {
        throw new Error("Producto no encontrado");
      }

      try {
        return product;
      } catch (error) {
        console.log(error);
      }
    },
    getClients: async (_, {}) => {
      try {
        const clients = await Client.find({});
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClientsSeller: async (_, {}, ctx) => {
      const { user } = ctx;

      if (!user) {
        throw new Error("Usuario no identificado.");
      }

      try {
        const clients = await Client.find({ seller: user.id.toString() });
        return clients;
      } catch (error) {
        console.log(error);
      }
    },
    getClient: async (_, { id }, ctx) => {
      const { user } = ctx;
      console.log(user);

      if (!user) {
        throw new Error("Usuario no identificado.");
      }

      const client = await Client.findById({ _id: id });

      if (user.id.toString() !== client.seller.toString()) {
        throw new Error("Acción no permitida.");
      }

      try {
        return client;
      } catch (error) {
        console.log(error);
      }
    },
    getOrders: async (_, {}) => {
      try {
        const orders = await Order.find();
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrdersBySeller: async (_, {}, ctx) => {
      const { user } = ctx;

      if (!user) {
        throw new Error("Usuario no identificado.");
      }

      try {
        const orders = await Order.find({ seller: user.id.toString() });
        return orders;
      } catch (error) {
        console.log(error);
      }
    },
    getOrder: async (_, { id }, ctx) => {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      console.log(isValid);
      if (!isValid) {
        throw new Error("ID no válido");
      }

      const { user } = ctx;

      if (!user) {
        throw new Error("Usuario no identificado.");
      }

      const order = await Order.findById({ _id: id });
      console.log(order);

      if (!order) {
        throw new Error("Orden no encontrada.");
      }

      if (user.id.toString() !== order.seller.toString()) {
        throw new Error("Acción no permitida.");
      }

      try {
        return order;
      } catch (error) {
        console.log(error);
      }
    },
    getOrderByState: async (_, {state}, ctx) =>{
      try {
        const response = await Order.find({state})
        return response;
      } catch (error) {
        console.log(error)
      }

    },
    getBestClients: async (_, {}, ctx) =>{
      const clients = await Order.aggregate([
        { $match: { state: "COMPLETADO" }},
        { $group:  {
          _id: "$client",
          total: {$sum: "$total"}
        }},
        {
          $lookup:{
            from: "clients",
            localField: "_id",
            foreignField: "_id",
            as: "client"
          }
        },{
          $sort :{
            total: -1
          }
        }
      ])

      return clients
    },
    getBestSeller: async () =>{
      const sellers = await Order.aggregate([
        {$match: {state: "COMPLETADO"}},
        {
          $group: {
            _id: "$seller",
            total: {$sum: "$total"}
          }
        },
        {
          $lookup:{
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "seller"
          }
        },
        {
          $limit: 5
        },{
          $sort: {total: -1}
        }
      ]);
      return sellers;
    },
    getProductsByName: async (_, {text}) =>{
      const products = await Product.find({
        $text: {
          $search: text
        }
      }).limit(10)

      return products;

    }
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const { email, password } = input;

      const isUser = await User.findOne({ email });

      const salt = await bcryptjs.genSalt(10);

      if (isUser) {
        throw new Error("Ya existe el usuario");
      }

      input.password = await bcryptjs.hash(password, salt);

      try {
        const user = new User(input);
        await user.save();
        return user;
      } catch (error) {
        console.log(error);
      }
    },
    authUser: async (_, { input }) => {
      const { email, password } = input;
      //Si el usuario existe

      const isUser = await User.findOne({ email });
      if (!isUser) {
        throw new Error("Usuario no registrado");
      }

      //Revisar pass
      const checkPass = await bcryptjs.compare(password, isUser.password);
      if (!checkPass) {
        throw new Error("El password no coincide");
      }

      //Token
      return {
        token: crearToken(isUser, process.env.SECRET, "24h"),
      };
    },
    createProduct: async (_, { input }) => {
      console.log("Creating new product...");
      try {
        const product = new Product(input);
        await product.save();
        return product;
      } catch (error) {
        console.log(error);
      }
    },
    updateProduct: async (_, { id, input }) => {
      //Validamos el ID
      const isValid = mongoose.Types.ObjectId.isValid(id);
      console.log(isValid);
      if (!isValid) {
        throw new Error("ID no válido");
      }

      let product = await Product.findById(id);

      if (!product) {
        throw new Error("Producto no encontrado");
      }
      try {
        product = await Product.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
        return product;
      } catch (error) {
        console.log(error);
      }
    },
    deleteProduct: async (_, { id }) => {
      //Validamos el ID
      const isValid = mongoose.Types.ObjectId.isValid(id);
      console.log(isValid);
      if (!isValid) {
        throw new Error("ID no válido");
      }

      let product = await Product.findById(id);

      if (!product) {
        throw new Error("Producto no encontrado.");
      }

      try {
        await product.findOneAndDelete({ _id: id });
        return "Producto Eliminado.";
      } catch (error) {
        console.log(error);
      }
    },
    newClient: async (_, { input }, ctx) => {
      const { email } = input;
      const { user } = ctx;

      const client = await Client.findOne({ email });
      if (client) {
        throw new Error("Cliente ya regostradp.");
      }

      //Asignar vendedor
      const newClient = new Client(input);
      newClient.seller = user.id;

      //Almacenar en bd
      try {
        const result = await newClient.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      const { user } = ctx;
      console.log(isValid);

      if (!isValid) {
        throw new Error("ID no válido");
      }

      let client = await Client.findById(id);

      if (!client) {
        throw new Error("Cliente no encontrado");
      }

      if (user.id.toString() !== client.seller.toString()) {
        throw new Error("Acción no permitida");
      }

      try {
        client = await Client.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
        return client;
      } catch (error) {
        console.log(error);
      }
    },
    deleteClient: async (_, { id }, ctx) => {
      const isValid = mongoose.Types.ObjectId.isValid(id);
      const { user } = ctx;
      console.log(isValid);

      if (!isValid) {
        throw new Error("ID no válido");
      }

      let client = await Client.findById(id);

      if (!client) {
        throw new Error("Cliente no encontrado");
      }

      if (user.id.toString() !== client.seller.toString()) {
        throw new Error("Acción no permitida");
      }

      try {
        await Client.findOneAndDelete({ _id: id });
        return "Cliente eliminado.";
      } catch (error) {
        console.log(error);
      }
    },
    newOrder: async (_, { input }, ctx) => {
      const { client, order } = input;
      const { user } = ctx;

      //Validar formato id
      const isValid = mongoose.Types.ObjectId.isValid(client);
      if (!isValid) {
        throw new Error("ID no válido");
      }

      //Verificar si el cliente existe
      let isClient = await Client.findById(client);
      if (!isClient) {
        throw new Error("Cliente no existe");
      }

      //Verificar si el usuario esta logeado
      if (user.id.toString() !== isClient.seller.toString()) {
        throw new Error("Acción no permitida.");
      }

      //Verificar si hay stock
      for await (const item of order) {
        const { id } = item;

        let product = await Product.findById(id);

        if (item.quantity > product.stock) {
          throw new Error(
            `El stock del producto ${product.name} excede la cantidad disponible`
          );
        } else {
          //Descontar productor del stock total
          product.stock = product.stock - item.quantity;

          try {
            await product.save();
          } catch (error) {
            console.log(error);
          }
        }
      }

      const newOrder = new Order(input);

      newOrder.seller = user.id;

      try {
        const result = await newOrder.save();
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    updateOrder: async (_, { id, input }, ctx) => {
      const { client, order } = input;
      //Valida ID
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new Error("ID no válido");
      }

      //Validar user
      const { user } = ctx;
      if (!user) {
        throw new Error("Usuario no identificado.");
      }

      const isOrder = await Order.findById(id);

      if (!isOrder) {
        throw new Error("Orden no encontrada.");
      }

      const isCliente = await Client.findById(client);
      if (!isCliente) {
        throw new Error("Cliente no encontrada.");
      }

      if (isCliente.seller.toString() !== user.id.toString()) {
        throw new Error("Accion no permitida");
      }

      if (order) {
        for await (const item of order) {
          const { id } = item;
          let product = await Product.findById(id);

          for await (const j of isOrder.order) {
            if (item.quantity > product.stock) {
              throw new Error(
                `El stock del producto ${product.name} excede la cantidad disponible`
              );
            }

            let rest = (await j.quantity) - item.quantity;

            if (rest == 0) {
              console.log("son iguales");
              product.stock = product.stock;
            } else if (rest > 0) {
              console.log("el valor antiguo es mayor");
              product.stock = j.quantity - item.quantity + product.stock;
            } else if (rest < 0) {
              console.log("el valor nuevo es mayor");
              product.stock = product.stock - (item.quantity - j.quantity);
            }

            /*  switch (rest) {
                case (rest > 0 ):
                console.log("el valor antiguo es mayor")
                product.stock =((j.quantity - item.quantity) + product.stock);
                
                break;
                case (rest = 0 ):
                  console.log("Son iguales")
                  product.stock = product.stock;
                  
                break;
                case (rest < 0 ):
                  console.log("el valor nuevo es mayor")
                  product.stock =((j.quantity - item.quantity) - product.stock);
                
                break;
              default:
                break;
            } */

            //Descontar productor del stock total
            // ;

            try {
              await product.save();
            } catch (error) {
              console.log(error);
            }
          }
        }
      }

      try {
        const result = await Order.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    deleteOrder: async (_, { id }, ctx) => {
      //Validar sesión
      const { user } = ctx;
      if (!user) {
        throw new Error("Usuario no identificado.");
      }
      //Validar Id
      const isValid = mongoose.Types.ObjectId.isValid(id);
      if (!isValid) {
        throw new Error("ID no válido");
      }

      //Validar que exista pedido
      const isOrder = await Order.findById(id);
      if (!isOrder) {
        throw new Error("Order no encontrada.");
      }

      //Validar que el user sea el mismo que elimina
      if (user.id.toString() !== isOrder.seller.toString()) {
        throw new Error("Acción no válida.");
      }
      //Regresar el stock de los productos
      for await (const item of isOrder.order) {
        const { id } = item;

        let product = await Product.findById(id);

        //Descontar productor del stock total
        product.stock = product.stock + item.quantity;

        try {
          await product.save();
        } catch (error) {
          console.log(error);
        }
      }
      //Eliminar
      try {
        await Order.findOneAndDelete({_id: id});
        return "Pedido eliminado"
      } catch (error) {
        console.log(error);
      }


    },
  },
};

module.exports = resolvers;
