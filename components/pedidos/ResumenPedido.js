import React, { useContext, useEffect } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";
import ProductoResumen from "./ProductoResumen";
import styled from "@emotion/styled";

/* Estilos */
const Line = styled.div`
  display: grid;
  grid-template-columns: 3% 97%;
`;

function ResumenPedido() {
  // Context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { productos, actualizarTotal } = pedidoContext;

  useEffect(() => {
    actualizarTotal();
  }, [productos]);

  return (
    <>
      <Line className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm rounded font-bold w-4/5">
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            /* fill-rule="evenodd" */
            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z"
            /* clip-rule="evenodd" */
          ></path>
        </svg>
        {/* <p>2.- Selecciona o busca los productos</p> */}
        <p>3.- Ajustar cantidades de productos en el carrito</p>
      </Line>
      {productos.length > 0 ? (
        <>
          {productos.map((producto) => (
            <ProductoResumen key={producto.id} producto={producto} />
          ))}
        </>
      ) : (
        <p className="mt-5 text-sm">Aún no hay productos</p>
      )}
    </>
  );
}

export default ResumenPedido;
