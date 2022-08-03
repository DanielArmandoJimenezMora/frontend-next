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
const OBTENER_PRODUCTO = gql`
  query obtenerProducto($id: ID!) {
    obtenerProducto(id: $id) {
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

const ACTUALIZAR_PRODUCTO = gql`
  mutation actualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
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

const Select = styled.select`
  width: 100%;
  height: 2rem;
  background-color: #fff;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  font-weight: 300;
  letter-spacing: 1px;
  box-sizing: border-box;
`;

const Container = styled.div`
  height: 80vh;
  border-radius: 10px !important;
`;
/* Fin de estilos */

const EditarProducto = () => {
  const router = useRouter();
  const {
    query: { pid },
  } = router;

  const id = pid;

  /* Consultar para obtener el producto */
  const { data, loading, error, client } = useQuery(OBTENER_PRODUCTO, {
    variables: { id },
  });
  const datosC = useQuery(OBTENER_CLIENTES_USUARIO);
  const dataC = datosC.data;
  const loadingC = datosC.loading;

  // Mutation para modificar el producto
  const [actualizarProducto] = useMutation(ACTUALIZAR_PRODUCTO);

  // Schema de validación
  const schemaValidation = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    presentacion: Yup.string(),
    existencia: Yup.number()
      .required("Es necesario agregar la cantidad disponible")
      .positive("No puedes agregar números negativos a la existencia")
      .integer("La existencia debe de ser en números enteros"),
    existenciaDeseada: Yup.number()
      .required("La existencia deseada es obligatoria")
      .positive("No puedes agregar números negativos a la existencia deseada")
      .integer("La existencia debe de ser en números enteros"),
    preCompra: Yup.number()
      .required("El precio de compra es obligatorio")
      .positive("No se aceptan números negativos"),
    precio: Yup.number()
      .required("El precio de venta es obligatorio")
      .positive("No se aceptan números negativos"),
    tipoProducto: Yup.string().required("El tipo de producto es obligatorio"),
  });

  if (loading || loadingC) return <Cargando />;

  if (!data) {
    return (id) => {
      Router.push({
        pathname: "/editarproducto/[id]",
        query: { id },
      });
    };
  }

  if (!dataC.obtenerClientesVendedor) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  const { obtenerProducto } = data;

  const actualizarInfoProducto = async (valores) => {
    const {
      nombre,
      presentacion,
      existencia,
      existenciaDeseada,
      precio,
      preCompra,
      tipoProducto,
    } = valores;
    try {
      const { data } = await actualizarProducto({
        variables: {
          id,
          input: {
            nombre,
            presentacion,
            existencia,
            existenciaDeseada,
            precio,
            preCompra,
            tipoProducto,
          },
        },
      });

      // Router para redireccionar a la página de productos
      router.push("/productos");
      // Mostrar una alerta
      Swal.fire(
        "Actualizado!",
        "El producto se actualizó correctamente",
        "success"
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>
      <br />
      <hr />

      <Container className="overflow-x-scroll mt-3">
        <div className="">
          <Formik
            enableReinitialize
            initialValues={obtenerProducto}
            validationSchema={schemaValidation}
            onSubmit={(valores) => {
              actualizarInfoProducto(valores);
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
                      placeholder="Nombre del producto"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                    />
                  </div>
                  {/* Fin Nombre */}

                  {/* Presentación */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="presentacion"
                    >
                      Presentación
                      {props.touched.presentacion &&
                      props.errors.presentacion ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.presentacion}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="presentacion"
                      type="text"
                      placeholder="Ej. c/10 500 gr"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.presentacion}
                    />
                  </div>
                  {/* Fin Presentación */}

                  {/* Existencia */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="existencia"
                    >
                      <Obligatorio>*</Obligatorio> Existencia
                      {props.touched.existencia && props.errors.existencia ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.existencia}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="existencia"
                      type="number"
                      placeholder="Cantidad disponible actual del producto"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.existencia}
                    />
                  </div>
                  {/* Fin de Existencia */}

                  {/* Existencia Deseada */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="existenciaDeseada"
                    >
                      <Obligatorio>*</Obligatorio> Existencia deseada
                      {props.touched.existenciaDeseada &&
                      props.errors.existenciaDeseada ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.existenciaDeseada}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="existenciaDeseada"
                      type="number"
                      placeholder="Cantidad deseada de existencia del producto"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.existenciaDeseada}
                    />
                  </div>
                  {/* Fin de Existencia Deseada */}

                  {/* Precio de compra */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="preCompra"
                    >
                      <Obligatorio>*</Obligatorio> Precio de compra
                      {props.errors.precio ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.precio}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="precio"
                      type="number"
                      placeholder="Precio del producto"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.preCompra}
                    />
                  </div>
                  {/* Fin de Precio */}

                  {/* Precio de venta*/}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="precio"
                    >
                      <Obligatorio>*</Obligatorio> Precio
                      {props.errors.precio ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.precio}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="precio"
                      type="number"
                      placeholder="Precio del producto"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.precio}
                    />
                  </div>
                  {/* Fin de Precio */}

                  {/* Tipo de producto */}
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="tipoProducto"
                  >
                    <Obligatorio>*</Obligatorio> Categoría
                    {props.touched.tipoProducto && props.errors.tipoProducto ? (
                      <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                        <p>
                          <span className="font-bold">Error: </span>
                          {props.errors.tipoProducto}
                        </p>
                      </Error>
                    ) : null}
                  </label>

                  <Select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    name="tipoProducto"
                    value={props.values.tipoProducto}
                    onChange={props.handleChange}
                    onBlur={props.handleBlur}
                  >
                    <option value="" label="Selecciona una categoría">
                      Selecciona una categoría{" "}
                    </option>
                    <option value="Farmacia" label="Farmacia">
                      {" "}
                      Farmacia
                    </option>
                    <option value="Dulcería" label="Dulcería">
                      {" "}
                      Dulcería
                    </option>
                    <option value="Abarrote" label="Abarrote">
                      {" "}
                      Abarrote
                    </option>
                  </Select>
                  {/* Fin de Tipo de producto */}

                  {/* Botones */}
                  <R>
                    <input
                      type="submit"
                      className="bg-green-500 mt-5 p-2 text-white rounded font-bold hover:bg-green-600"
                      value="Guardar Cambios"
                    />
                    <Link href="/productos">
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

export default EditarProducto;
