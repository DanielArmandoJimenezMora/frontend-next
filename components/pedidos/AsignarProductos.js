import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";
import styled from "@emotion/styled";

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      presentacion
      existencia
      existenciaDeseada
      precio
      tipoProducto
    }
  }
`;

/* Estilos */
const Line = styled.div`
  display: grid;
  grid-template-columns: 3% 97%;
`;

const AsignarProductos = () => {
  // State local del componente
  const [productos, setProductos] = useState([]);

  // Context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { agregarProducto } = pedidoContext;

  // Consulta a la base de datos
  const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

  useEffect(() => {
    // TODO: Funcion para pasar pedidoState.js
    agregarProducto(productos);
  }, [productos]);

  const seleccionarProducto = (producto) => {
    setProductos(producto);
  };

  if (loading) return null;
  const { obtenerProductos } = data;

  return (
    <>
      <Line className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm rounded font-bold w-4/5 ">
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
        </svg>
        {/* <p>2.- Selecciona o busca los productos</p> */}
        <p>2.- Agregar productos al carrito de compras</p>
      </Line>
      <Select
        className="mt-3 w-4/5"
        options={obtenerProductos}
        onChange={(opcion) => seleccionarProducto(opcion)}
        isMulti={true}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) =>
          `${opciones.nombre} - ${
            opciones.presentacion === null ? "" : opciones.presentacion
          } | Disponibles: ${opciones.existencia}`
        }
        placeholder="Busque o seleccione productos"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
};

export default AsignarProductos;
