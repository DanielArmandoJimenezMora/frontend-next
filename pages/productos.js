import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Producto from "../components/Producto";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import styled from "@emotion/styled";
import Cargando from "../components/Cargando";
import NoData from "../components/NoData";
import NoSesion from "../components/NoSesion";

const OBTENER_PRODUCTOS = gql`
  query obtenerProductos {
    obtenerProductos {
      id
      nombre
      presentacion
      existencia
      existenciaDeseada
      precio
      preCompra
      tipoProducto
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

export default function Productos() {
  const router = new useRouter();
  const { data, loading, client } = useQuery(OBTENER_PRODUCTOS);
  const dataUserFull = useQuery(OBTENER_USUARIO);
  const dataUser = dataUserFull.data;
  const loadingU = dataUserFull.loading;
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [selects, setSelects] = useState();

  const showData = async () => {
    const { data } = await client.query({
      query: OBTENER_PRODUCTOS,
    });
    setProductos(data.obtenerProductos);
  };

  const searcher = ({ target }) => {
    setSearch(target.value);
    console.log(target.value);
  };

  let resultados = [];
  if (!search) {
    resultados = productos;
  } else if (selects === "Nombre") {
    resultados = productos.filter((producto) => {
      return producto.nombre.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "tipoProducto") {
    resultados = productos.filter((producto) => {
      return producto.tipoProducto.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "presentacion") {
    resultados = productos.filter((producto) => {
      return producto.presentacion.toLowerCase().includes(search.toLowerCase());
    });
  }

  useEffect(() => {
    showData();
  });

  if (loading || loadingU) return <Cargando />;

  if (!data.obtenerProductos || !dataUser.obtenerUsuario) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  const perfil = dataUser.obtenerUsuario.perfil;

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Productos</h1>
        <hr />

        <ContainerTab className=" shadow mt-3">
          {perfil === "Administrador" ? (
            <Link href="/nuevoproducto">
              <a class="bg-cyan-800 py-2 px-5 inline-block text-white hover:bg-cyan-900  mb-3 rounded font-bold text-sm w-full lg:w-auto text-center">
                Nuevo producto
              </a>
            </Link>
          ) : (
            <div>
              <br />
              <br />
            </div>
          )}

          <div className="flex mb-5">
            <div className="w-1/3"></div>
            <div className="w-1/3">
              <Select
                className="text-right appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="searchSelect"
                value={selects}
                onChange={({ target }) => setSelects(target.value)}
              >
                <option
                  value="Null"
                  label="Seleccione filtro de búsqueda"
                  className="text-right"
                >
                  Null
                </option>
                <option
                  value="Nombre"
                  label="Buscar por: Nombre"
                  className="text-right"
                >
                  Nombre
                </option>
                <option
                  value="tipoProducto"
                  label="Buscar por: Categoría"
                  className="text-right"
                >
                  tipoProducto
                </option>
                <option
                  value="presentacion"
                  label="Buscar por: Presentación"
                  className="text-right"
                >
                  presentacion
                </option>
              </Select>
            </div>
            {selects === "Nombre" ||
            selects === "tipoProducto" ||
            selects === "presentacion" ? (
              <div className="w-1/3 shadow ">
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder={"Buscar producto"}
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
                    <th className="w-1/5 py-2 border px-4">Nombre</th>
                    <th className="w-1/5 py-2 border px-4">Presentación</th>
                    {perfil === "Administrador" ? (
                      <th className="w-1/5 py-2 border px-4">Precio compra</th>
                    ) : null}
                    <th className="w-1/5 py-2 border px-4">Precio venta</th>
                    <th className="w-1/5 py-2 border px-4">Existencia</th>
                    <th className="w-1/5 py-2 border px-4">
                      Existencia Deseada
                    </th>
                    <th className="w-1/5 py-2  border px-4">Categoría</th>
                    {perfil === "Administrador" ? (
                      <th className="w-1/5 py-2 border px-4">Acciones</th>
                    ) : null}
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {resultados.map((producto) => (
                    <Producto key={producto.id} producto={producto} />
                  ))}
                </tbody>
              </Table>
            ) : (
              <NoData></NoData>
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
