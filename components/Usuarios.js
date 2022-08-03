import React from "react";
import Swal from "sweetalert2";
import { gql, useMutation } from "@apollo/client";
import styled from "@emotion/styled";
import Router from "next/router";

/* GraphQL */
const ELIMINAR_USUARIO = gql`
  mutation eliminarUsuario($id: ID!) {
    eliminarUsuario(id: $id)
  }
`;

const OBTENER_USUARIOS = gql`
  query obtenerUsuarios {
    obtenerUsuarios {
      id
      nombre
      apellido
      email
      genero
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

const Usuario = ({ usuario }) => {
  // Mutation para eliminar usuario
  const [eliminarUsuario] = useMutation(ELIMINAR_USUARIO, {
    update(cache) {
      // Obtener copia del objeto de cache
      const { obtenerUsuarios } = cache.readQuery({
        query: OBTENER_USUARIOS,
      });
      // Reescribir el cache
      cache.writeQuery({
        query: OBTENER_USUARIOS,
        data: {
          obtenerUsuario: obtenerUsuarios.filter(
            (usuarioActual) => usuarioActual.id !== usuario.id
          ),
        },
      });
    },
  });
  const { id, nombre, apellido, email, genero, perfil } = usuario;

  console.log();

  // Eliminar Usuario
  const confirmarEliminarUsuario = () => {
    Swal.fire({
      title: `¿Estás seguro de eliminar a ${nombre} ${apellido}?`,
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
          // Eliminar por id y despues mostrar una alerta
          const { data } = await eliminarUsuario({
            variables: {
              id,
            },
          });
          Swal.fire("¡Eliminado!", data.eliminarUsuario, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editarUsuario = (id) => {
    Router.push({
      pathname: "/editarusuario/[id]",
      query: { id },
    });
  };

  return (
    <tr>
      <td className="border px-4 py-2">
        {nombre} {apellido}
      </td>
      <td className="border px-4 py-2">{genero}</td>
      <td className="border px-4 py-2">{email}</td>
      <td className="border px-4 py-2">{!perfil ? "Vendedor" : perfil}</td>
      <td className="border px-4 py-2">
        <Td>
          {/* Editar */}
          <button
            type="button"
            className="flex justify-center items-center bg-sky-700 py-2 px-4 w-full text-white rounded text-xs hover:bg-sky-900 font-bold"
            onClick={() => editarUsuario(id)}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path>
              <path
                fillRule="evenodd"
                d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                clipRule="evenodd"
              ></path>
            </svg>
            Editar
          </button>
          {/* Fin Editar */}
          {/* Eliminar */}
          <button
            type="button"
            className="flex justify-center items-center bg-red-700 py-2 px-4 w-full text-white rounded ml-2 text-xs hover:bg-red-800 font-bold"
            onClick={() => confirmarEliminarUsuario()}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            Eliminar
          </button>
          {/* Fin eliminar */}
        </Td>
      </td>
    </tr>
  );
};

export default Usuario;
