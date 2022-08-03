import React, { useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const Search = () => {
  // Setear hooks useState
  const [item, setItem] = useState([]);
  const [search, setSearch] = useState("");

  // función para traer los datos de la
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

  const { data, loading, client } = useQuery(OBTENER_CLIENTES_USUARIO);

  // metodo de filtrado

  // función de busqueda

  // renderizado

  return <div></div>;
};

export default Search;
