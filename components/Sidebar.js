import React from "react";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";

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

/* Styled Components */
const Aside = styled.aside`
  background-image: linear-gradient(
    to top,
    rgb(17 24 39) 10%,
    rgb(4 7 15) 100%
  );
  /* position: absolute; */
  /*  height: 100vh; */
  -webkit-box-shadow: 7px 8px 12px -5px rgba(110, 110, 110, 1);
  -moz-box-shadow: 7px 8px 12px -5px rgba(110, 110, 110, 1);
  box-shadow: 7px 8px 12px -5px rgba(110, 110, 110, 1);
`;

const Heading = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
`;

const Title = styled.p`
  padding-top: 1.5rem;
  padding-left: 1rem;
`;

const Item = styled.div`
  display: grid;
  grid-template-columns: 10% 90%;
  padding-left: 2rem;
  cursor: pointer;
`;

const ItemImg = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  align-items: center;
  cursor: pointer;
`;

const ItemText = styled.a`
  padding-left: 1rem;
`;

const Usuario = styled.li`
  margin-bottom: 1rem;
`;

const Sidebar = () => {
  // Routing de Next.js
  const router = useRouter();

  // Querty Apollo
  const { data, loading, client } = useQuery(OBTENER_USUARIO);
  // Proteger que no se acceda a data antes de obtener resultados
  if (loading) return null;
  if (!data.obtenerUsuario) {
    return null;
  }

  const { nombre, apellido, genero, perfil } = data.obtenerUsuario;

  return (
    <Aside className="sm:w-1/4 xl:w:-1/5 sm:min-h-screen overflow-x-scroll p-5">
      {/* <aside className="bg-gray-800 sm:w-1/4 xl:w:-1/5 sm:min-h-screen p-5"> */}
      {/* Heading sidebar */}
      <Heading>
        {/* Logo */}
        <div>
          <Image width={84} height={104} src="/img/logo.png" alt="Logo" />
        </div>
        {/* Nombre empresa */}
        <div className="mb-8">
          <Title className="text-white sm:text-xl xl:text-xl">
            Dulces y medicina <br />
            popular &quot;Morita&quot;
          </Title>
        </div>
      </Heading>
      <hr />
      {/* Menu */}
      <nav className="mt-5 list-none">
        <Usuario className="p-3">
          <ItemImg>
            <div>
              {genero === "Hombre" ? (
                <Image width={80} height={80} src="/img/icon/user1.png" alt="Usuario" />
              ) : genero === "Mujer" ? (
                <Image width={80} height={80} src="/img/icon/user2.png" alt="Usuario" />
              ) : genero === "Otro" ? (
                <Image width={100} height={110} src="/img/icon/user3.png" alt="Usuario" />
              ) : null}
            </div>
            <div>
              <ItemText className="text-white block">
                {nombre} {apellido}
              </ItemText>
              <p className="text-white ml-4 text-sm">{perfil}</p>
            </div>
          </ItemImg>
        </Usuario>

        {/* Pedidos */}
        <li
          className={
            router.pathname === "/pedidos" || router.pathname === "/nuevopedido"
              ? "bg-gray-900 p-3 border-l-8 border-l-blue-900"
              : "p-3"
          }
        >
          <Link href="/pedidos">
            <Item>
              <div>
                <Image width={20} height={28} src="/img/icon/pedido.png" alt="Pedidos"/>
              </div>
              <ItemText className="text-white block">Pedidos</ItemText>
            </Item>
          </Link>
        </li>

        {/* Clientes */}
        <li
          className={
            router.pathname === "/" || router.pathname === "/nuevocliente"
              ? "bg-gray-900 p-3 border-l-8 border-l-blue-900"
              : "p-3"
          }
        >
          <Link href="/">
            <Item>
              <div>
                <Image width={26} height={22} src="/img/icon/cliente.png" alt="Clientes" />
              </div>
              <ItemText className="text-white block">Clientes</ItemText>
            </Item>
          </Link>
        </li>

        {/* Proveedores */}
        {perfil === "Administrador" ? (
          <li
            className={
              router.pathname === "/proveedores"
                ? "bg-gray-900 p-3 border-l-8 border-l-blue-900"
                : "p-3"
            }
          >
            <Link href="/proveedores">
              <Item>
                <div>
                  <Image
                    width={22}
                    height={26}
                    src="/img/icon/proveedores.png"
                    alt="Proveedores"
                  />
                </div>
                <ItemText className="text-white block">Proveedores</ItemText>
              </Item>
            </Link>
          </li>
        ) : null}
        {/* Productos */}
        <li
          className={
            router.pathname === "/productos" ||
            router.pathname === "/nuevoproducto"
              ? "bg-gray-900 p-3 border-l-8 border-l-blue-900"
              : "p-3"
          }
        >
          <Link href="/productos">
            <Item>
              <div>
                <Image width={26} height={22} src="/img/icon/carrito.png" alt="Productos" />
              </div>
              <ItemText className="text-white block">Productos</ItemText>
            </Item>
          </Link>
        </li>
        {/* Usuarios */}
        {perfil === "Administrador" ? (
          <li
            className={
              router.pathname === "/usuarios"
                ? "bg-gray-900 p-3 border-l-8 border-l-blue-900"
                : "p-3"
            }
          >
            <Link href="/usuarios">
              <Item>
                <div>
                  <Image width={26} height={22} src="/img/icon/user+.png" alt="Usuarios" />
                </div>
                <ItemText className="text-white block">Usuarios</ItemText>
              </Item>
            </Link>
          </li>
        ) : null}

        <nav className="mt-5 list none">
          <div className="text-white text-xl ml-3 mb-3">Reportes</div>
          {/*  */}
          <li
            className={
              router.pathname === "/mejoresvendedores"
                ? "bg-gray-900 p-3 border-l-8 border-l-blue-900"
                : "p-3"
            }
          >
            <Link href="/mejoresvendedores">
              <Item>
                <div className="text-white">
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"></path>
                  </svg>
                </div>
                <ItemText className="text-white block mt-1">
                  Reporte de Ventas
                </ItemText>
              </Item>
            </Link>
          </li>
          {/*  */}
          <li
            className={
              router.pathname === "/mejoresclientes"
                ? "bg-gray-900 p-3 border-l-8 border-l-blue-900"
                : "p-3"
            }
          >
            <Link href="/mejoresclientes">
              <Item>
                <div className="text-white">
                  <svg
                    className="w-7 h-7"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
                  </svg>
                </div>
                <ItemText className="text-white block mt-1">
                  Reporte de Clientes
                </ItemText>
              </Item>
            </Link>
          </li>
        </nav>
      </nav>
    </Aside>
  );
};

export default Sidebar;
