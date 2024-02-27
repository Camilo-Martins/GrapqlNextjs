import { createContext, useReducer } from "react";

import { PedidoReducer, PedidoState } from "./PedidoReducer";
import { Producto } from "@/interfaces/Producto";
import { Cliente } from "@/interfaces/Cliente";
import productos from "@/pages/productos";
type PedidoProps = {
  errorMesagge: string;
  total: number | null;
  status: "CANCELADO" | "APROBADO" | "SUSPENDIDO" | "NO_APLICA";
  productos: Producto[];
  cliente: {};
  calcularTotal: () => void;
  removeError: () => void;
  agregarCliente: (cliente: Cliente[]) => void;
  agregarProductos: (producto: []) => void;
  cantidadProductos: (nuevoProducto: any) => void;
  actualizarTotal: () => void;
};

const inicialState: PedidoState = {
  errorMesagge: "",
  total: 0,
  status: "NO_APLICA",
  cliente: {},
  productos: [],
};

export const PedidoContext = createContext({} as PedidoProps);

export const PedidoProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(PedidoReducer, inicialState);

  const calcularTotal = () => {};

  const agregarCliente = (cliente: Cliente[]) => {
    console.log(cliente);
    dispatch({
      type: "SELECCIONAR_CLIENTE",
      payload: cliente,
    });
  };

  const agregarProductos = (productosSelect: []) => {
    let nuevoState : Producto[];
    if (state.productos.length > 0) {
      nuevoState = productosSelect.map((producto: Producto) => {
        const nuevoObjeto = state.productos.find(
          (productoState) => productoState.id === producto.id
        );
        return {
          ...producto,
          ...nuevoObjeto,
        };
      });
    } else {
      nuevoState = productosSelect;
    }

    dispatch({
      type: "SELECCIONAR_PRODUCTO",
      payload: nuevoState,
    });
  };

  const cantidadProductos = (nuevoProducto: any) => {
    dispatch({
      type: "CANTIDAD_PRODUCTO",
      payload: nuevoProducto,
    });
  };

  const actualizarTotal = () =>{
   dispatch({
    type: "ACTUALIZAR_TOTAL"
   })
  }


  const removeError = () => {};

  return (
    <PedidoContext.Provider
      value={{
        ...state,
        productos: state.productos,
        total: state.total,
        cliente: state.cliente,
        calcularTotal,
        removeError,
        agregarCliente,
        agregarProductos,
        cantidadProductos,
        actualizarTotal
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};
