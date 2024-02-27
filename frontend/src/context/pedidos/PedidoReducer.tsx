import { Cliente } from "@/interfaces/Cliente";
import {  Producto } from "@/interfaces/Producto";

export interface PedidoState {
  errorMesagge: string;
  total: number | null;
  status: "CANCELADO" | "APROBADO" | "SUSPENDIDO" | "NO_APLICA";
  productos: Producto[];
  cliente: {};
}

type PedidoAction =
  | { type: "SELECCIONAR_CLIENTE"; payload: Cliente[] }
  | { type: "SELECCIONAR_PRODUCTO"; payload: [] }
  | { type: "CANTIDAD_PRODUCTO"; payload: Producto  }
  | {type: "ACTUALIZAR_TOTAL"; }

export const PedidoReducer = (
  state: PedidoState,
  action: PedidoAction
): PedidoState => {
  switch (action.type) {
    case "CANTIDAD_PRODUCTO":
      return {
        ...state,
        productos: state.productos.map((producto: Producto) =>
          producto.id === action.payload.id
            ? (producto = action.payload)
            : producto
        ),
        errorMesagge: "No se ha podido calcular el total",
      };
    case "SELECCIONAR_CLIENTE":
      return {
        ...state,
        cliente: action.payload,
        status: "NO_APLICA",
        errorMesagge: "No se ha podido calcular el total",
      };
    case "SELECCIONAR_PRODUCTO":
      return {
        ...state,
        status: "NO_APLICA",
        productos: action.payload,
        errorMesagge: "No se ha podido calcular el total",
      };
    case "ACTUALIZAR_TOTAL":
      return{
        ...state,
        total: state.productos.reduce((nuevoTotal, produto) =>
          nuevoTotal += produto.price * (produto.cantidad ? produto.cantidad : 1), 0
        )
      };
    default:
      return state;
  }
};
