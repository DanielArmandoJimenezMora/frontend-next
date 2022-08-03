import React, { useContext, useState, useEffect } from "react";
import PedidoContext from "../../context/pedidos/PedidoContext";

function ProductoResumen({ producto }) {
  // Context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { cantidadProductos, actualizarTotal } = pedidoContext;

  const [cantidad, setCantidad] = useState(0);

  useEffect(() => {
    actualizarCantidad();
    actualizarTotal();
  }, [cantidad]);

  const actualizarCantidad = () => {
    const nuevoProducto = { ...producto, cantidad: Number(cantidad) };
    cantidadProductos(nuevoProducto);
  };

  const { nombre, precio, presentacion } = producto;

  return (
    <div className="md-flex md-justitfy-between w-4/5 md:items-center mt-5 flex">
      <div className="md:w-2/4 mb-2 md:mb-0 ml-5">
        <p>
          <span className="font-bold"> Producto: </span>
          {nombre} {presentacion}
        </p>
        <p>
          <span className="font-bold"> Precio: </span>${precio}
        </p>
      </div>
      <div className="">
        <p className="text-sm">Cantidad:</p>
      </div>
      <input
        type="number"
        placeholder="Cantidad"
        className="shadow apperance-none border rounded w-2/5 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
        onChange={({ target }) => setCantidad(target.value)}
        value={precio ? cantidad : 0}
      />
    </div>
  );
}

export default ProductoResumen;
