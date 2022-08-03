import React, { useState, useEffect, useContext } from "react";
import Select from "react-select";
import { gql, useQuery } from "@apollo/client";
import PedidoContext from "../../context/pedidos/PedidoContext";
import styled from "@emotion/styled";

/* GraphQL */
const OBTENER_CLIENTES_USUARIO = gql`
  query ObtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      telefono
      direccion
      nombreNegocio
      email
      vendedor
    }
  }
`;

/* Estilos */
const Line = styled.div`
  display: grid;
  grid-template-columns: 3% 97%;
`;

function AsignarCliente() {
  const [cliente, setCliente] = useState([]);

  // Context de pedidos
  const pedidoContext = useContext(PedidoContext);
  const { agregarCliente } = pedidoContext;

  // Consultar la base de datos
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

  useEffect(() => {
    agregarCliente(cliente);
  }, [cliente]);

  const seleccionarCliente = (clientes) => {
    setCliente(clientes);
  };

  // Resultados de la consulta
  if (loading) return null;

  const { obtenerClientesVendedor } = data;

  return (
    <>
      <Line className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm rounded font-bold w-4/5">
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
        </svg>
        <p>1.- Asigna un Cliente al pedido</p>
      </Line>
      <Select
        className="mt-3 w-4/5"
        options={obtenerClientesVendedor}
        onChange={(opcion) => seleccionarCliente(opcion)}
        getOptionValue={(opciones) => opciones.id}
        getOptionLabel={(opciones) =>
          `Cliente: ${opciones.nombre} ${opciones.apellido} - Nombre del negocio: ${opciones.nombreNegocio}`
        }
        placeholder="Busque o seleccione el cliente"
        noOptionsMessage={() => "No hay resultados"}
      />
    </>
  );
}

export default AsignarCliente;
