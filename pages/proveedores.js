import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Proveedor from "../components/Proveedores";
import Link from "next/link";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Cargando from "../components/Cargando";
import NoData from "../components/NoData";
import NoSesion from "../components/NoSesion";

/* GraphQL */
const OBTENER_PROVEEDORES = gql`
  query obtenerProveedores {
    obtenerProveedores {
      id
      nombre
      telefono
      direccion
      email
      categoria
      creado
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

export default function Proveedores() {
  const router = new useRouter();
  const { data, loading, client } = useQuery(OBTENER_PROVEEDORES);
  const datosU = useQuery(OBTENER_USUARIO);
  const dataU = datosU.data;
  const loadingU = datosU.loading;
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState("");
  const [selects, setSelects] = useState();

  const showData = async () => {
    const { data } = await client.query({
      query: OBTENER_PROVEEDORES,
    });
    setProveedores(data.obtenerProveedores);
  };

  const searcher = ({ target }) => {
    setSearch(target.value);
    console.log(target.value);
  };

  let resultados = [];
  if (!search) {
    resultados = proveedores;
  } else if (selects === "Nombre") {
    resultados = proveedores.filter((proveedor) => {
      return proveedor.nombre.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "telefono") {
    resultados = proveedores.filter((proveedor) => {
      return proveedor.telefono.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "direccion") {
    resultados = proveedores.filter((proveedor) => {
      return proveedor.direccion.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "email") {
    resultados = proveedores.filter((proveedor) => {
      return proveedor.email.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "categoria") {
    resultados = proveedores.filter((proveedor) => {
      return proveedor.categoria.toLowerCase().includes(search.toLowerCase());
    });
  }

  useEffect(() => {
    showData();
  });

  if (loading || loadingU) return <Cargando />;

  if (!data.obtenerProveedores || !dataU.obtenerUsuario) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  const perfil = dataU.obtenerUsuario.perfil;

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Proveedores</h1>
        <hr />
        <ContainerTab className=" shadow mt-3">
          {perfil === "Administrador" ? (
            <Link href="/nuevoproveedor">
              <a className="bg-cyan-800 py-2 px-5 inline-block text-white hover:bg-cyan-900  mb-3 rounded font-bold text-sm w-full lg:w-auto text-center">
                Nuevo proveedor
              </a>
            </Link>
          ) : null}

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
                  value="telefono"
                  label="Buscar por: Teléfono"
                  className="text-right"
                >
                  Teléfono
                </option>
                <option
                  value="direccion"
                  label="Buscar por: Dirección"
                  className="text-right"
                >
                  Dirección
                </option>
                <option
                  value="email"
                  label="Buscar por: Email"
                  className="text-right"
                >
                  Email
                </option>
                <option
                  value="categoria"
                  label="Buscar por: categoría"
                  className="text-right"
                >
                  Categoria
                </option>
              </Select>
            </div>
            {selects === "Nombre" ||
            selects === "telefono" ||
            selects === "direccion" ||
            selects === "email" ||
            selects === "categoria" ? (
              <div className="w-1/3 shadow ">
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder={"Buscar proveedor"}
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
                    <th className="w-1/5 py-2 border px-4 py-2">Nombre</th>
                    <th className="w-1/5 py-2 border px-4 py-2">Teléfono</th>
                    <th className="w-1/5 py-2 border px-4 py-2">Dirección</th>
                    <th className="w-1/5 py-2  border px-4 py-2">Email</th>
                    <th className="w-1/5 py-2  border px-4 py-2">Categorías</th>
                    {perfil === "Administrador" ? (
                      <th className="w-1/5 py-2 border px-4 py-2">Acciones</th>
                    ) : null}
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {resultados.map((proveedor) => (
                    <Proveedor key={proveedor.id} proveedor={proveedor} />
                  ))}
                </tbody>
              </Table>
            ) : (
              <NoData></NoData>
            )}
          </SubContainer>
          <div className="text-right mt-7 text-sm">
            <p className="">
              Total de proveedores encontrados: <span>{resultados.length}</span>
            </p>
          </div>
        </ContainerTab>
      </Layout>
    </div>
  );
}
