import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";
import styled from "@emotion/styled";
import Link from "next/link";
import Router from "next/router";
import { gql, useQuery, useMutation } from "@apollo/client";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import Cargando from "../../components/Cargando";
import NoSesion from "../../components/NoSesion";

/* GraphQL */
const OBTENER_PROVEEDOR = gql`
  query obtenerProveedor($id: ID!) {
    obtenerProveedor(id: $id) {
      id
      nombre
      telefono
      direccion
      email
      categoria
    }
  }
`;

const ACTUALIZAR_PROVEEDOR = gql`
  mutation actualizarProveedor($id: ID!, $input: ProveedorInput) {
    actualizarProveedor(id: $id, input: $input) {
      id
      nombre
      telefono
      direccion
      email
      categoria
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
const R = styled.div`
  text-align: right;
`;
const Obligatorio = styled.span`
  color: red;
  font-weight: bold;
`;

const Error = styled.div`
  width: 100%;
  text-align: left;
  padding: 8px;
`;

const Container = styled.div`
  height: 80vh;
  border-radius: 10px !important;
`;
/* Fin de estilos */

const EditarProveedor = () => {
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const id = pid;

  /* Consultar para obtener el proveedor */
  const { data, loading, error, client } = useQuery(OBTENER_PROVEEDOR, {
    variables: { id },
  });
  const datosC = useQuery(OBTENER_CLIENTES_USUARIO);
  const dataC = datosC.data;
  const loadingC = datosC.loading;

  // Mutation para modificar el Proveedor
  const [actualizarProveedor] = useMutation(ACTUALIZAR_PROVEEDOR);

  // Schema de validación
  const schemaValidation = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    telefono: Yup.string().required("El teléfono es obligatorio"),
    direccion: Yup.string().required("La dirección es obligatoria"),
    email: Yup.string(),
    categoria: Yup.string(),
  });

  if (loading || loadingC) return <Cargando />;

  if (!data) {
    return (id) => {
      Router.push({
        pathname: "/editarproveedor/[id]",
        query: { id },
      });
    };
  }

  if (!dataC.obtenerClientesVendedor) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  const { obtenerProveedor } = data;

  const actualizarInfoProveedor = async (valores) => {
    const { nombre, telefono, direccion, email, categoria } = valores;
    try {
      const { data } = await actualizarProveedor({
        variables: {
          id,
          input: {
            nombre,
            telefono,
            direccion,
            email,
            categoria,
          },
        },
      });

      // Router para redireccionar a la página de proveedor
      router.push("/proveedores");
      // Mostrar una alerta
      Swal.fire(
        "Actualizado!",
        "El proveedor se actualizó correctamente",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Proveedor</h1>
      <br />
      <hr />

      <Container className="overflow-x-scroll mt-3">
        <div>
          <Formik
            enableReinitialize
            initialValues={obtenerProveedor}
            validationSchema={schemaValidation}
            onSubmit={(valores) => {
              actualizarInfoProveedor(valores);
            }}
          >
            {(props) => {
              return (
                <form
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                  onSubmit={props.handleSubmit}
                >
                  {/* Nombre */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="nombre"
                    >
                      <Obligatorio>*</Obligatorio> Nombre
                      {props.touched.nombre && props.errors.nombre ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.nombre}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="nombre"
                      type="text"
                      placeholder="Nombre del Proveedor"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                    />
                  </div>
                  {/* Fin Nombre */}

                  {/* Telefono */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="telefono"
                    >
                      <Obligatorio>*</Obligatorio> Telefono
                      {props.touched.telefono && props.errors.telefono ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.telefono}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="telefono"
                      type="text"
                      placeholder="Teléfono del Proveedor"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.telefono}
                    />
                  </div>
                  {/* Fin Telefono */}

                  {/* Direccion */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="direccion"
                    >
                      <Obligatorio>*</Obligatorio> Direccion
                      {props.touched.direccion && props.errors.direccion ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.direccion}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="direccion"
                      type="text"
                      placeholder="Dirección del Proveedor"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.direccion}
                    />
                  </div>
                  {/* Fin Direccion */}

                  {/* Email */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      Correo Electrónico
                      {props.touched.email && props.errors.email ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.email}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="email"
                      type="email"
                      placeholder="Email del Proveedor"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                    />
                  </div>
                  {/* Fin Email */}

                  {/* Categoría */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="categoria"
                    >
                      Categorías
                      {props.touched.categoria && props.errors.categoria ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.categoria}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="categoria"
                      type="text"
                      placeholder="Categoría del Proveedor"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.categoria}
                    />
                  </div>
                  {/* Fin Categoría */}

                  {/* Botones */}
                  <R>
                    <input
                      type="submit"
                      className="bg-green-500 mt-5 p-2 text-white rounded font-bold hover:bg-green-600"
                      value="Guardar Cambios"
                    />
                    <Link href="/proveedores">
                      <input
                        type="submit"
                        className="bg-red-600 ml-3 mt-5 p-2 text-white rounded font-bold hover:bg-red-700"
                        value="Cancelar"
                      />
                    </Link>
                  </R>
                </form>
              );
            }}
          </Formik>
        </div>
      </Container>
    </Layout>
  );
};

export default EditarProveedor;
