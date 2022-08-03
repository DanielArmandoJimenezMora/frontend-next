import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Usuario from "../components/Usuarios";
import Link from "next/link";
import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { gql, useQuery } from "@apollo/client";
import Cargando from "../components/Cargando";
import NoData from "../components/NoData";
import NoSesion from "../components/NoSesion";

/* GraphQL */
const OBTENER_USUARIOS = gql`
  query obtenerUsuarios {
    obtenerUsuarios {
      id
      nombre
      apellido
      genero
      email
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

const SubContainer = styled.div`
  height: 58vh;
`;

const ContainerTab = styled.div`
  height: 83vh;
  border-radius: 10px !important;
  padding: 30px 25px;
  background-color: #fff;
`;

const Table = styled.table`
  tr:nth-child(odd) td {
    background-color: rgb(245 245 245);
  }
`;
/* Fin Estilos */

export default function Index() {
  const router = new useRouter();
  const { data, loading, client } = useQuery(OBTENER_USUARIOS);
  const datosU = useQuery(OBTENER_CLIENTES_USUARIO);
  const dataU = datosU.data;
  const loadingU = datosU.loading;
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");
  const [selects, setSelects] = useState();

  const showData = async () => {
    const { data } = await client.query({
      query: OBTENER_USUARIOS,
    });
    setUsuarios(data.obtenerUsuarios);
  };

  const searcher = ({ target }) => {
    setSearch(target.value);
    console.log(target.value);
  };

  let resultados = [];
  if (!search) {
    resultados = usuarios;
  } else if (selects === "Nombre") {
    resultados = usuarios.filter((usuario) => {
      return usuario.nombre.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "Apellido") {
    resultados = usuarios.filter((usuario) => {
      return usuario.apellido.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "Correo") {
    resultados = usuarios.filter((usuario) => {
      return usuario.email.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "Genero") {
    resultados = usuarios.filter((usuario) => {
      return usuario.genero.toLowerCase().includes(search.toLowerCase());
    });
  } else if (selects === "Perfil") {
    resultados = usuarios.filter((usuario) => {
      usuario.perfil.toLowerCase().includes(search.toLowerCase());
    });
  }

  useEffect(() => {
    showData();
  });

  if (loading || loadingU) return <Cargando />;

  if (!data.obtenerUsuarios || !dataU.obtenerClientesVendedor) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Usuarios</h1>
        <hr />

        <ContainerTab className=" shadow mt-3">
          <Link href="/nuevousuario">
            <a class="bg-cyan-800 py-2 px-5 inline-block text-white hover:bg-cyan-900  mb-3 rounded font-bold text-sm w-full lg:w-auto text-center">
              Nuevo Usuario
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
                <option value="Correo" label="Buscar por: Correo">
                  Correo
                </option>
                <option value="Genero" label="Buscar por: Género">
                  Genero
                </option>
                <option value="Perfil" label="Buscar por: Rol">
                  Perfil
                </option>
              </Select>
            </div>
            {selects === "Nombre" ||
            selects === "Apellido" ||
            selects === "Correo" ||
            selects === "Genero" ||
            selects === "Perfil" ? (
              <div className="w-1/3 shadow ">
                <input
                  value={search}
                  onChange={searcher}
                  type="text"
                  placeholder="Buscar usuario"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                    <th className="w-1/5 py-2 border px-4 py-2">Género</th>
                    <th className="w-1/5 py-2 border px-4 py-2">Correo</th>
                    <th className="w-1/5 py-2 border px-4 py-2">Rol</th>
                    <th className="w-1/5 py-2 border px-4 py-2">Acciones</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {resultados.map((usuario) => (
                    <Usuario key={usuario.id} usuario={usuario} />
                  ))}
                </tbody>
              </Table>
            ) : (
              <NoData></NoData>
            )}
          </SubContainer>
          <div className="text-right mt-7 text-sm">
            <p className="">
              Total de usuarios encontrados: <span>{resultados.length}</span>
            </p>
          </div>
        </ContainerTab>
      </Layout>
    </div>
  );
}
