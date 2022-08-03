import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Cliente from "../components/Clientes";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "@emotion/styled";
import Cargando from "../components/Cargando";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import NoSesion from "../components/NoSesion";

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
      genero
    }
  }
`;

const OBTENER_CLIENTES = gql`
  query obtenerClientes {
    obtenerClientes {
      id
      nombre
      apellido
      nombreNegocio
      telefono
      direccion
      email
    }
  }
`;

const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      perfil
    }
  }
`;

/* Estilos */
const P = styled.p`
  color: #fff;
`;

const Select = styled.select`
  width: 100%;
  height: 2.3rem;
  background-color: #fff;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  font-weight: 300;
  letter-spacing: 1px;
  box-sizing: border-box;
  direction: rtl;
  cursor: pointer;
`;

const ContainerTab = styled.div`
  height: 83vh;
  border-radius: 10px !important;
  padding: 30px 25px;
  background-color: #fff;
`;

const SubContainer = styled.div`
  height: 58vh;
`;

const Table = styled.table`
  tr:nth-child(odd) td {
    background-color: rgb(245 245 245);
  }
`;

/* Fin Estilos */

export default function Index() {
  const router = new useRouter();
  const { data, loading, client } = useQuery(OBTENER_CLIENTES_USUARIO);
  const datosC = useQuery(OBTENER_CLIENTES);
  const dataC = datosC.obtenerClientes;
  const loadingC = datosC.loading;
  const datosU = useQuery(OBTENER_USUARIO);
  const dataU = datosU.obtenerClientes;
  const loadingU = datosU.loading;

  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState("");
  const [selects, setSelects] = useState();

  const showData = async () => {
    if (perfil === "Administrador") {
      const { data } = await client.query({
        query: OBTENER_CLIENTES,
      });
      setClientes(data.obtenerClientes);
    } else {
      const { data } = await client.query({
        query: OBTENER_CLIENTES_USUARIO,
      });
      setClientes(data.obtenerClientesVendedor);
    }
  };

  const searcher = ({ target }) => {
    setSearch(target.value);
    console.log(target.value);
  };

  let resultados = [];

  if (!search) {
    resultados = clientes;
  } else if (selects === "Nombre") {
    resultados = clientes.filter((cliente) => {
      return cliente.nombre.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "Apellido") {
    resultados = clientes.filter((cliente) => {
      return cliente.apellido.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "nombreNegocio") {
    resultados = clientes.filter((cliente) => {
      return cliente.nombreNegocio.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "Teléfono") {
    resultados = clientes.filter((cliente) => {
      return cliente.telefono.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "Dirección") {
    resultados = clientes.filter((cliente) => {
      return cliente.direccion.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "Correo") {
    resultados = clientes.filter((cliente) => {
      return cliente.email.toLowerCase().includes(search.toLowerCase());
    });
  }

  useEffect(() => {
    showData();
  });

  //console.log(data);
  if (loading || loadingU || loadingC) return <Cargando />;

  if (
    !data.obtenerClientesVendedor ||
    !datosC.data.obtenerClientes ||
    !datosU.data.obtenerUsuario
  ) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  //console.log(datosU.data.obtenerUsuario.perfil);
  const perfil = datosU.data.obtenerUsuario.perfil;

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
        <hr />

        <ContainerTab className=" shadow mt-3">
          <Link href="/nuevocliente">
            <a className="bg-cyan-800 py-2 px-5 inline-block text-white hover:bg-cyan-900  mb-3 rounded font-bold text-sm w-full lg:w-auto text-center">
              Nuevo Cliente
            </a>
          </Link>

          <div className="flex mb-5">
            <div className="w-1/3"></div>
            <div className="w-1/3">
              <Select
                className="text-right appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="searchSelect"
                value={selects}
                onChange={({ target }) => setSelects(target.value)}
              >
                <option value="Null" label="Seleccione filtro de búsqueda">
                  Null
                </option>
                <option value="Nombre" label="Buscar por: Nombre">
                  Nombre
                </option>
                <option value="Apellido" label="Buscar por: Apellido">
                  Apellido
                </option>
                <option
                  value="nombreNegocio"
                  label="Buscar por: Nombre de negocio"
                >
                  nombreNegocio
                </option>
                <option value="Teléfono" label="Buscar por: Teléfono">
                  Teléfono
                </option>
                <option value="Dirección" label="Buscar por: Dirección">
                  Dirección
                </option>
                <option value="Correo" label="Buscar por: Correo">
                  Correo
                </option>
              </Select>
            </div>
            {selects === "Nombre" ||
            selects === "Apellido" ||
            selects === "nombreNegocio" ||
            selects === "Teléfono" ||
            selects === "Dirección" ||
            selects === "Correo" ? (
              <div className="w-1/3 shadow ">
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder="Buscar cliente"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
            ) : null}
          </div>

          <SubContainer className="overflow-x-scroll">
            {resultados.length > 0 ? (
              <Table className="table-auto w-full w-lg">
                <thead className="bg-white border-b-2 border-slate-300 ">
                  <tr className="text-stone-900">
                    <th className="w-1/5 border px-4 py-2">Nombre</th>
                    <th className="w-1/5 border px-4 py-2">Negocio</th>
                    <th className="w-1/5 border px-4 py-2">Teléfono</th>
                    <th className="w-1/5 border px-4 py-2">Dirección</th>
                    <th className="w-1/5 border px-4 py-2">Correo</th>
                    <th className="w-1/5 border px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {resultados.map((cliente) => (
                    <Cliente key={cliente.id} cliente={cliente} />
                  ))}
                </tbody>
              </Table>
            ) : (
              <div>
                <Player
                  autoplay
                  loop
                  src="https://assets4.lottiefiles.com/packages/lf20_qszkkg7n.json"
                  style={{ height: "400px", width: "400px" }}
                >
                  <Controls
                    visible={false}
                    buttons={["play", "repeat", "frame", "debug"]}
                  />
                </Player>
                <p className="text-center text-2xl">
                  No se encontraron resultados
                </p>
              </div>
            )}
          </SubContainer>
          <div className="text-right mt-7 text-sm">
            <p className="">
              Total de productos encontrados: <span>{resultados.length}</span>
            </p>
          </div>
        </ContainerTab>
      </Layout>
    </div>
  );
}
