import React, { useState, useEffect } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import Swal from "sweetalert2";

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

const ACTUALIZAR_PEDIDO = gql`
  mutation actualizarPedido($id: ID!, $input: PedidoInput) {
    actualizarPedido(id: $id, input: $input) {
      estado
    }
  }
`;

const ELIMINAR_PEDIDO = gql`
  mutation eliminarPedido($id: ID!) {
    eliminarPedido(id: $id)
  }
`;

const OBTENER_PEDIDOS = gql`
  query obtenerPedidos {
    obtenerPedidos {
      id
    }
  }
`;
const OBTENER_TODOS_PEDIDOS = gql`
  query obtenerPedidos {
    obtenerPedidos {
      id
    }
  }
`;

const Pedido = ({ pedido }) => {
  const {
    id,
    total,
    cliente: { nombre, apellido, telefono, email, nombreNegocio, direccion },
    estado,
    cliente,
  } = pedido;
  const datosU = useQuery(OBTENER_USUARIO);
  const loadingU = useQuery(OBTENER_USUARIO);

  // Mutation para cambiar el estado de un pedido
  const [actualizarPedido] = useMutation(ACTUALIZAR_PEDIDO);
  const [eliminarPedido] = useMutation(ELIMINAR_PEDIDO, {
    update(cache) {
      // Obtener el objeto de cache que deseamos actualizar
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });

      // Reescribir el cache
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: obtenerPedidosVendedor.filter(
            (pedidoActual) => pedidoActual.id !== id
          ),
        },
      });
    },
  });

  const [eliminarPedidoAdmin] = useMutation(ELIMINAR_PEDIDO, {
    update(cache) {
      // Obtener el objeto de cache que deseamos actualizar
      const { obtenerPedidos } = cache.readQuery({
        query: OBTENER_TODOS_PEDIDOS,
      });

      // Reescribir el cache
      cache.writeQuery({
        query: OBTENER_TODOS_PEDIDOS,
        data: {
          obtenerPedidos: obtenerPedidos.filter(
            (pedidoActual) => pedidoActual.id !== id
          ),
        },
      });
    },
  });

  const [estadoPedido, setEstadoPedido] = useState(estado);
  const [clase, setClase] = useState("");

  // Funcion que modifica el color del pedido de acuerdo a su estado
  const clasePedido = () => {
    if (estadoPedido === "PENDIENTE") {
      setClase("border-l-yellow-500");
    } else if (estadoPedido === "COMPLETADO") {
      setClase("border-l-green-500");
    } else {
      setClase("border-l-red-700");
    }
  };

  const cambiarEstadoPedido = async (nuevoEstado) => {
    try {
      const { data } = await actualizarPedido({
        variables: {
          id,
          input: {
            estado: nuevoEstado,
            cliente: cliente.id,
          },
        },
      });
      setEstadoPedido(nuevoEstado);
    } catch (error) {
      console.log(error);
    }
  };

  const eliminaPedido = async () => {
    try {
      await eliminarPedido({
        variables: {
          id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const confirmarEliminarPedido = () => {
    Swal.fire({
      title: `¿Estás seguro de eliminar a?`,
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
          const data = await eliminarPedido({
            variables: {
              id,
            },
          });
          Swal.fire("Pedido eliminado", data.eliminarPedido, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const confirmarEliminarPedidoAdmin = () => {
    Swal.fire({
      title: `¿Estás seguro de eliminar a?`,
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
          const data = await eliminarPedidoAdmin({
            variables: {
              id,
            },
          });
          Swal.fire("Pedido eliminado", data.eliminarPedido, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };
  useEffect(() => {
    if (estadoPedido) {
      setEstadoPedido(estadoPedido);
    }
    clasePedido();
  }, [estadoPedido]);
  return (
    <div
      className={` border-1 border-grey-200 border-l-8 ${clase}  mb-4 bg-white rounded p-6 md:grid  md:grid-cols-2 md:gap-4 shadow-lg`}
    >
      <div>
        <p className="font-bold mb-4">Datos del cliente</p>
        <p className="font-bold text-gray-800 flex item-center">
          <svg
            className="w-5 h-5 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              /* fill-rule="evenodd" */
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              /* clip-rule="evenodd" */
            ></path>
          </svg>
          Cliente:
          <span className="font-light ml-2">
            {nombre} {apellido}
          </span>
        </p>
        <p className="font-bold text-gray-800 flex items-center">
          <svg
            className="w-5 h-5 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              /* fill-rule="evenodd" */
              d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
              /* clip-rule="evenodd" */
            ></path>
          </svg>
          Negocio: <span className="font-light ml-2">{nombreNegocio}</span>
        </p>
        <p className="font-bold text-gray-800 flex items-center">
          <svg
            className="w-5 h-5 mr-1"
            /* fill="currentColor" */
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              /* fill-rule="evenodd" */
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              /* clip-rule="evenodd" */
            ></path>
          </svg>
          Dirección: <span className="font-light ml-2">{direccion}</span>
        </p>
        <p className="font-bold text-gray-800 flex items-center">
          <svg
            className="w-5 h-5 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
          </svg>
          Teléfono: <span className="font-light ml-2">{telefono}</span>
        </p>
        <p className="font-bold text-gray-800 flex items-center">
          <svg
            className="w-5 h-5 mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              /* fill-rule="evenodd" */
              d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
              /* clip-rule="evenodd" */
            ></path>
          </svg>
          Correo: <span className="font-light ml-2">{email}</span>
        </p>
        <br />
        <hr />
        <h2 className="text-gray-800 font-bold mt-5">Estado del pedido:</h2>
        <select
          className="mt-2 appearance-none bg-cyan-700 border-cyan-700 text-white p-2 rounded leading-tight focus:outline-none focus:bg-cyan-700 focus:border-cyan-600 text-xs font-bold text-center"
          value={estadoPedido}
          onChange={(e) => cambiarEstadoPedido(e.target.value)}
        >
          <option value="COMPLETADO">Completado</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>
      <div>
        <h2 className="text-gray-800 font-bold mt-2">Descripción del Pedido</h2>
        {pedido.pedido.map((articulo) => (
          <div key={articulo.id} className="mt-4">
            <p className="text-sm text-gray-600">Producto: {articulo.nombre}</p>
            {
              <p className="text-sm text-gray-600">
                Precio: ${articulo.precio}
              </p>
            }
            {
              <p className="text-sm text-gray-600">
                Cantidad: {articulo.cantidad}
              </p>
            }
            {
              <p className="text-sm text-gray-600">
                Subtotal: {articulo.precio * articulo.cantidad}
              </p>
            }
          </div>
        ))}

        <p className="text-gray- mt-3 font-bold">
          Total a pagar:{" "}
          <span className="font-light text-cyan-900">${total}</span>
        </p>
        {estadoPedido === "COMPLETADO" || estadoPedido === "CANCELADO" ? (
          <button
            type="button"
            className="flex  text-xs items-center mt-4 bg-red-700 px-5 py-2  text-white rounded leading-tight font-bold"
            onClick={() => confirmarEliminarPedido()}
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
                /*  clip-rule="evenodd" */
              ></path>
            </svg>
            Eliminar Pedido
          </button>
        ) : (
          <button
            type="button"
            className="flex text-xs items-center mt-4 bg-red-700 px-5 py-2  text-white rounded leading-tight font-bold opacity-50 cursor-not-allowed"
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
            Eliminar Pedido
          </button>
        )}
      </div>
    </div>
  );
};

export default Pedido;
