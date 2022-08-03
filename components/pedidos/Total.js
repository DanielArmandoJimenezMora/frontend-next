import React, { useContext } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

function Total() {
  // Context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { cantidadProductos, actualizarTotal } = pedidoContext;
  const { total } = pedidoContext;

  return (
    <div className="md-flex md-justify-between md:items-center w-4/5">
      <div className="flex items-center mt-5 justify-between bg-gray-300 p-3 border-solid border-2 border-gray-400 rounded">
        <h2 className="text-gray-800 text-lg">Total a pagar: </h2>
        <p className="text-gray-800 mt-0 text-right ">${total}</p>
      </div>
    </div>
  );
}

export default Total;
