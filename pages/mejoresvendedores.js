import React, { useEffect } from "react";
import Layout from "../components/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Cargando from "../components/Cargando";
import NoSesion from "../components/NoSesion";

const MEJORES_VENDEDORES = gql`
  query mejoresVendedores {
    mejoresVendedores {
      vendedor {
        nombre
        apellido
        genero
        email
      }
      total
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

const OBTENER_CLIENTES_USUARIO = gql`
  query ObtenerClientesVendedor {
    obtenerClientesVendedor {
      id
    }
  }
`;

const Mejoresvendedores = () => {
  const router = new useRouter();
  const { data, loading, error, client, startPolling, stopPolling } =
    useQuery(MEJORES_VENDEDORES);
  const datosU = useQuery(OBTENER_USUARIO);
  const datosC = useQuery(OBTENER_CLIENTES_USUARIO);
  const dataC = datosC.data;
  const loadingC = datosC.loading;

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  if (loading || loadingC) return <Cargando />;

  if (!dataC.obtenerClientesVendedor) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  const { mejoresVendedores } = data;

  const vendedorGrafica = [];

  mejoresVendedores.map((vendedor, index) => {
    vendedorGrafica[index] = {
      ...vendedor.vendedor[0],
      datosVendedor:
        vendedor.vendedor[0].nombre + " " + vendedor.vendedor[0].apellido,
      total: vendedor.total,
      genero: vendedor.vendedor[0].genero,
    };
  });

  const ventaTotal = vendedorGrafica.reduce(
    (total, vendedor) => total + vendedor.total,
    0
  );

  const ventaTotalM = vendedorGrafica.reduce(
    (total, vendedor) =>
      total + (vendedor.genero === "Mujer" ? vendedor.total : 0),
    0
  );

  const ventaTotalH = vendedorGrafica.reduce(
    (total, vendedor) =>
      total + (vendedor.genero === "Hombre" ? vendedor.total : 0),
    0
  );

  const ventaTotalO = vendedorGrafica.reduce(
    (total, vendedor) =>
      total + (vendedor.genero === "Otro" ? vendedor.total : 0),
    0
  );

  const perfil = datosU.data.obtenerUsuario.perfil;

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Reporte de Ventas</h1>
      <br />
      <hr />

      {perfil === "Administrador" ? (
        <div>
          <div className="flex">
            {/* Todos */}
            <p className="flex shadow mr-4 mt-2 my-2 bg-white border-l-4 border-green-700 text-green-700 p-2 text-sm rounded font-bold w-2/4">
              <svg
                className="w-11 h-11"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="mt-3">
                Reporte de ventas totales: ${ventaTotal} pesos.
              </span>
            </p>
            {/* Hombres */}
            <p className="flex shadow mt-2 my-2 bg-white border-l-4 border-cyan-700 text-cyan-700 p-2 text-sm rounded font-bold w-2/4">
              <svg
                className="w-11 h-11"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="mt-3">
                Ventas totales hechas por Hombres: ${ventaTotalH} pesos.
              </span>
            </p>
          </div>
          <div className="flex">
            {/* Otros */}
            <p className="flex shadow mr-4 mt-1 my-2 bg-white border-l-4 border-purple-700 text-purple-700 p-2 text-sm rounded font-bold w-2/4">
              <svg
                className="w-11 h-11"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="mt-3">
                Ventas totales hechas por Otros: ${ventaTotalO} pesos.
              </span>
            </p>
            {/* Mujeres */}
            <p className="flex shadow mt-1 my-2 bg-white border-l-4 border-pink-500 text-pink-500 p-2 text-sm rounded font-bold w-2/4">
              <svg
                className="w-11 h-11"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="mt-2">
                Ventas totales hechas por Mujeres: ${ventaTotalM}
              </span>
            </p>
          </div>
        </div>
      ) : null}

      <ResponsiveContainer
        width="100%"
        height={`${perfil === "Administrador" ? "66%" : "83%"}`}
        className="shadow bg-white rounded overflow-x-scroll w-full mt-2"
      >
        <BarChart
          width={1000}
          height={600}
          data={vendedorGrafica}
          margin={{
            top: 50,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="datosVendedor" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
};

export default Mejoresvendedores;
