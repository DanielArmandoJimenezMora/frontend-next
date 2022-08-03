import React, { useContext, useState } from "react";
import Layout from "../components/Layout";
import AsignarCliente from "../components/pedidos/AsignarCliente";
import AsignarProductos from "../components/pedidos/AsignarProductos";
import ResumenPedido from "../components/pedidos/ResumenPedido";
import Total from "../components/pedidos/Total";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import styled from "@emotion/styled";
import Cargando from "../components/Cargando";
import NoSesion from "../components/NoSesion";

// Context de pedidos
import PedidoContext from "../context/pedidos/PedidoContext";

/* GraphQL */
const NUEVO_PEDIDO = gql`
  mutation nuevoPedido($input: PedidoInput) {
    nuevoPedido(input: $input) {
      id
    }
  }
`;

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

const OBTENER_PEDIDOS = gql`
  query obtenerPedidosVendedor {
    obtenerPedidosVendedor {
      id
      pedido {
        id
        cantidad
        nombre
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

/* Estilos */
const Container = styled.div`
  padding-left: 3rem;
  width: 100%;
  height: 80vh;
  padding-bottom: 3rem;
`;

const Nuevopedido = () => {
  const router = useRouter();
  const [mensaje, setMensaje] = useState(null);

  // Utilizar Context y extraer sus funciones y valores
  const pedidoContext = useContext(PedidoContext);
  const { cliente, productos, total } = pedidoContext;

  const { data, loading, client } = useQuery(OBTENER_CLIENTES_USUARIO);

  // Mutations para nuevo pedido
  const [nuevoPedido] = useMutation(NUEVO_PEDIDO, {
    update(cache, { data: { nuevoPedido } }) {
      // Obtener el objeto de cache que deseamos actualizar
      const { obtenerPedidosVendedor } = cache.readQuery({
        query: OBTENER_PEDIDOS,
      });
      cache.writeQuery({
        query: OBTENER_PEDIDOS,
        data: {
          obtenerPedidosVendedor: [...obtenerPedidosVendedor, nuevoPedido],
        },
      });
    },
  });

  const validarPedido = () => {
    return !productos.every((producto) => producto.cantidad > 0) ||
      total === 0 ||
      cliente.length === 0
      ? " opacity-50 cursor-not-allowed "
      : "";
  };

  const crearNuevoPedido = async () => {
    const { id } = cliente;

    //Remover lo no deseado de productos
    const pedido = productos.map(
      ({
        __typename,
        existencia,
        existenciaDeseada,
        presentacion,
        tipoProducto,
        ...producto
      }) => producto
    );
    // console.log(pedido);

    try {
      const { data } = await nuevoPedido({
        variables: {
          input: {
            cliente: id,
            total,
            pedido,
          },
        },
      });
      // Redireccionar
      router.push("/pedidos");

      // Mostrar Alerta
      Swal.fire(
        "Pedido creado",
        "El pedido se registró correctamente",
        "success"
      );
    } catch (error) {
      setMensaje(error.message.replace("GraphQL error: ", ""));
      setTimeout(() => {
        setMensaje(null);
      }, 3000);
    }
  };

  const mostrarMensaje = () => {
    return (
      <div className="mt-10 my-2 bg-red-100 border-l-4 border-r-4 border-red-800 text-center text-red-700 p-2 text-sm rounded font-bold w-4/5">
        <p>{mensaje}</p>
      </div>
    );
  };

  if (loading) return <Cargando />;

  if (!data.obtenerClientesVendedor) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Nuevo Pedido</h1>
      <br />
      <hr />
      <Container className="overflow-x-scroll">
        <AsignarCliente />
        <AsignarProductos />
        <ResumenPedido />
        <Total />
        {mensaje && mostrarMensaje()}
        {!productos.every((producto) => producto.cantidad > 0) ||
        total === 0 ||
        cliente.length === 0 ? (
          <button
            type="button"
            className={` bg-cyan-800 w-4/5 rounded mt-5 p-3 text-white font-bold hover:bg-cyan-900 ${validarPedido()} `}
          >
            Registrar pedido
          </button>
        ) : (
          <button
            type="button"
            className={` bg-cyan-800 w-4/5 rounded mt-5 p-3 text-white font-bold hover:bg-cyan-900 ${validarPedido()} `}
            onClick={() => crearNuevoPedido()}
          >
            Registrar pedido
          </button>
        )}
        <button
          type="button"
          className={
            "bg-red-500 w-4/5 rounded mt-5 p-3 text-white font-bold hover:bg-red-600"
          }
          onClick={() => router.push("/pedidos")}
        >
          Cancelar
        </button>
      </Container>
    </Layout>
  );
};

export default Nuevopedido;
