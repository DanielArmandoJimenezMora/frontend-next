import React from "react";
import styled from "@emotion/styled";
import Swal from "sweetalert2";
import { gql, useMutation, useQuery } from "@apollo/client";
import Router from "next/router";

const ELIMINAR_PRODUCTO = gql`
  mutation eliminarProducto($id: ID!) {
    eliminarProducto(id: $id)
  }
`;

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
const Td = styled.div`
  display: grid;
  grid-template-columns: 50% 50%;
  align-content: center;
`;

const Producto = ({ producto }) => {
  // Mutation para eliminar productos
  const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO, {
    update(cache) {
      const { obtenerProductos } = cache.readQuery({
        query: OBTENER_PRODUCTOS,
      });
      cache.writeQuery({
        query: OBTENER_PRODUCTOS,
        data: {
          obtenerProductos: obtenerProductos.filter(
            (productoActual) => productoActual.id !== id
          ),
        },
      });
    },
  });

  const dataUserFull = useQuery(OBTENER_USUARIO);
  const dataUser = dataUserFull.data;
  const perfil = dataUser.obtenerUsuario.perfil;

  const {
    id,
    nombre,
    presentacion,
    existencia,
    existenciaDeseada,
    precio,
    preCompra,
    tipoProducto,
  } = producto;

  const confirmarEliminarProducto = () => {
    Swal.fire({
      title: `¿Estás seguro de eliminar ${nombre} ?`,
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "No, cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Eliminar producto de la base de datos
          const { data } = await eliminarProducto({
            variables: {
              id,
            },
          });
          Swal.fire(
            "Producto eliminado correctamente",
            data.eliminarProducto,
            "success"
          );
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarProducto = () => {
    Router.push({
      pathname: "/editarproducto/[id]",
      query: { id },
    });
  };

  return (
    <tr>
      <td className="border px-4 py-2">{nombre}</td>
      <td className="border px-4 py-2">{presentacion}</td>
      {perfil === "Administrador" ? (
        <td className="border px-4 py-2">${preCompra}</td>
      ) : null}
      <td className="border px-4 py-2">${precio}</td>
      <td className="border px-4 py-2">{existencia}</td>
      <td className="border px-4 py-2">{existenciaDeseada}</td>
      <td className="border px-4 py-2">{tipoProducto}</td>
      {perfil === "Administrador" ? (
        <td className="border px-4 py-2">
          <Td>
            {/* Editar */}
            <button
              type="button"
              className="flex justify-center items-center bg-sky-700 py-2 px-4 w-full text-white rounded text-xs hover:bg-sky-900 font-bold"
              onClick={() => editarProducto()}
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
                <path
                  /* fill-rule="evenodd" */
                  d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                  /* clipRule="evenodd" */
                ></path>
              </svg>
              Editar
            </button>
            {/* Fin Editar */}
            {/* Eliminar */}
            <button
              type="button"
              className="flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded ml-2 text-xs hover:bg-red-800 font-bold"
              onClick={() => confirmarEliminarProducto()}
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  /* fill-rule="evenodd" */
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  /* clip-rule="evenodd" */
                ></path>
              </svg>
              Eliminar
            </button>
            {/* Fin eliminar */}
          </Td>
        </td>
      ) : null}
    </tr>
  );
};

export default Producto;
