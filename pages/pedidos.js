import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Pedido from "../components/Pedido";
import Link from "next/link";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Cargando from "../components/Cargando";
import NoPedido from "../components/NoPedido";
import NoSesion from "../components/NoSesion";

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
      genero
      perfil
    }
  }
`;

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
        precio
      }

      cliente {
        id
        nombre
        apellido
        telefono
        direccion
        nombreNegocio
        email
      }
      vendedor
      total
      estado
    }
  }
`;

/* Estilos  */
const ContainerPed = styled.div`
  height: 75vh;
`;

const Select = styled.select`
  height: 2.3rem;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  font-weight: 300;
  letter-spacing: 1px;
  box-sizing: border-box;
  direction: rtl;
  cursor: pointer;
`;
/* Fin estilos */

export default function Pedidos() {
  const router = new useRouter();
  const { data, loading, client } = useQuery(OBTENER_PEDIDOS);
  const datosU = useQuery(OBTENER_USUARIO);
  const dataU = datosU.data;
  const loadingU = datosU.loading;
  const [pedidos, setPedidos] = useState([]);
  const [search, setSearch] = useState("");
  const [selects, setSelects] = useState();

  const showData = async () => {
    const { data } = await client.query({
      query: OBTENER_PEDIDOS,
    });
    setPedidos(data.obtenerPedidosVendedor);
  };

  const searcher = ({ target }) => {
    setSearch(target.value);
    console.log(target.value);
  };

  let resultados = [];
  if (!search) {
    resultados = pedidos;
  } else if (selects === "Nombre") {
    resultados = pedidos.filter((pedido) => {
      return pedido.cliente.nombre.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "Apellido") {
    resultados = pedidos.filter((pedido) => {
      return pedido.cliente.apellido
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  } else if (selects === "nombreNegocio") {
    resultados = pedidos.filter((pedido) => {
      return pedido.cliente.nombreNegocio
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  } else if (selects === "direccion") {
    resultados = pedidos.filter((pedido) => {
      return pedido.cliente.direccion
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  } else if (selects === "telefono") {
    resultados = pedidos.filter((pedido) => {
      return pedido.cliente.telefono
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  } else if (selects === "email") {
    resultados = pedidos.filter((pedido) => {
      return pedido.cliente.email.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "estadoPedido") {
    resultados = pedidos.filter((pedido) => {
      if (pedido.estado === "COMPLETADO") {
        return pedido.estado.toLowerCase().includes(search.toLowerCase());
      } else if (pedido.estado === "PENDIENTE") {
        return pedido.estado.toLowerCase().includes(search.toLowerCase());
      } else if (pedido.estado === "CANCELADO") {
        return pedido.estado.toLowerCase().includes(search.toLowerCase());
      }
    });
  }

  useEffect(() => {
    showData();
  });

  if (loading || loadingU) return <Cargando />;

  if (!data.obtenerPedidosVendedor || !dataU.obtenerUsuario) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }


  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light mb-1">Pedidos</h1>

        <div className="xl:flex  mb-5 p-2 bg-white rounded">
          <div className="sm:w-full xl:w:-1/6">
            <Link href="/nuevopedido">
              <a className="bg-cyan-800 py-2 px-5 inline-block text-white rounded text-sm hover:bg-cyan-900 font-bold w-full lg:w-auto text-center ">
                Nuevo Pedido
              </a>
            </Link>
          </div>
          <div className="flex pt-1.5 text-green-600">
            Pedidos: <span className="ml-2">{resultados.length}</span>{" "}
          </div>
          <div className="sm:w-full xl:w:-2/6">
            <Select
              className="sm:text-left xl:text-right appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="searchSelect"
              value={selects}
              onChange={({ target }) => setSelects(target.value)}
            >
              <option
                value="Null"
                label="Seleccione filtro de búsqueda"
                className="sm:text-left xl:text-right"
              >
                Null
              </option>
              <option
                value="Nombre"
                label="Buscar por: Nombre"
                className="sm:text-left xl:text-right"
              >
                Nombre
              </option>
              <option
                value="Apellido"
                label="Buscar por: Apellido"
                className="sm:text-left xl:text-right"
              >
                Apellido
              </option>
              <option
                value="nombreNegocio"
                label="Buscar por: Nombre del Negocio"
                className="sm:text-left xl:text-right"
              >
                nombreNegocio
              </option>
              <option
                value="direccion"
                label="Buscar por: Dirección"
                className="sm:text-left xl:text-right"
              >
                Direccion
              </option>
              <option
                value="telefono"
                label="Buscar por: Telefono"
                className="sm:text-left xl:text-right"
              >
                Telefono
              </option>
              <option
                value="email"
                label="Buscar por: Correo"
                className="sm:text-left xl:text-right"
              >
                Email
              </option>
              <option
                value="estadoPedido"
                label="Buscar por: Estado del Pedido"
                className="sm:text-left xl:text-right"
              >
                estadoPedido
              </option>
            </Select>
          </div>
          <div className="sm:w-full xl:w:-2/6">
            {selects === "Nombre" ||
            selects === "Apellido" ||
            selects === "nombreNegocio" ||
            selects === "direccion" ||
            selects === "telefono" ||
            selects === "email" ||
            selects === "estadoPedido" ? (
              <input
                value={search}
                onChange={searcher}
                type="text"
                placeholder={"Buscar producto"}
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline shadow"
              />
            ) : null}
          </div>
        </div>

        <ContainerPed className="overflow-x-scroll rounded">
          {resultados.length === 0 ? (
            <NoPedido></NoPedido>
          ) : (
            resultados.map((pedido) =>
              pedido.cliente ? <Pedido key={pedido.id} pedido={pedido} /> : null
            )
          )}
        </ContainerPed>
      </Layout>
    </div>
  );
}
