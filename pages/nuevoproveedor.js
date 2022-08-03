import React from "react";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import Swal from "sweetalert2";
import styled from "@emotion/styled";
import Cargando from "../components/Cargando";
import NoSesion from "../components/NoSesion";

/* Mutation */
const NUEVO_PROVEEDOR = gql`
  mutation NuevoProveedor($input: ProveedorInput) {
    nuevoProveedor(input: $input) {
      id
      nombre
      telefono
      direccion
      email
      categoria
    }
  }
`;

/* Query */
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
      id
    }
  }
`;

/* Estilos */
const R = styled.div`
  text-align: right;
`;

const Error = styled.div`
  width: 100%;
  text-align: left;
  padding: 8px;
`;

const Obligatorio = styled.span`
  color: red;
  font-weight: bold;
`;

const Container = styled.div`
  height: 83vh;
  border-radius: 10px !important;
  background-color: #fff;
`;
/* Fin estilos */

const NuevoProveedor = () => {
  const router = useRouter();
  const datosU = useQuery(OBTENER_USUARIO);
  const dataU = datosU.data;
  const loadingU = datosU.loading;
  const client = datosU.client;

  // Mutation
  const [nuevoProveedor] = useMutation(NUEVO_PROVEEDOR, {
    update(cache, { data: { nuevoProveedor } }) {
      // Obteber el objeto del cache
      const { obtenerProveedores } = cache.readQuery({
        query: OBTENER_PROVEEDORES,
      });

      // Reescribir el objeto
      cache.writeQuery({
        query: OBTENER_PROVEEDORES,
        data: {
          obtenerProveedores: [...obtenerProveedores, nuevoProveedor],
        },
      });
    },
  });

  // Formulario para nuevos proveedores
  const formik = useFormik({
    initialValues: {
      nombre: "",
      telefono: "",
      direccion: "",
      email: "",
      categoria: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      telefono: Yup.string().required("El teléfono es obligatorio"),
      direccion: Yup.string().required("La dirección es obligatoria"),
      email: Yup.string(),
      categoria: Yup.string(),
    }),
    onSubmit: async (valores) => {
      const { nombre, telefono, direccion, email, categoria } = valores;

      try {
        const { data } = await nuevoProveedor({
          variables: {
            input: {
              nombre,
              telefono,
              direccion,
              email,
              categoria,
            },
          },
        });
        // console.log(data);

        // Mostrar una alerta proveedor
        Swal.fire(
          "Proveedor creado",
          "El proveedor se creó correctamente",
          "success"
        );

        // Redireccionar hacia los proveedores
        router.push("/proveedores");
      } catch (error) {
        console.log(error);
      }
    },
  });

  if (loadingU) return <Cargando />;

  if (!dataU.obtenerUsuario) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">
        Crear Nuevo Proveedor
      </h1>
      <hr />

      <Container className="overflow-x-scroll shadow-md mt-3">
        <div>
          <form
            className="bg-white px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
            {/* Nombre */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="nombre"
              >
                <Obligatorio>*</Obligatorio> Nombre
                {formik.touched.nombre && formik.errors.nombre ? (
                  <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p>
                      <span className="font-bold">Error: </span>
                      {formik.errors.nombre}
                    </p>
                  </Error>
                ) : null}
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                placeholder="Nombre del Proveedor"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
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
                {formik.touched.telefono && formik.errors.telefono ? (
                  <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p>
                      <span className="font-bold">Error: </span>
                      {formik.errors.telefono}
                    </p>
                  </Error>
                ) : null}
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="telefono"
                type="text"
                placeholder="Teléfono del Proveedor"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.telefono}
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
                {formik.touched.direccion && formik.errors.direccion ? (
                  <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p>
                      <span className="font-bold">Error: </span>
                      {formik.errors.direccion}
                    </p>
                  </Error>
                ) : null}
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="direccion"
                type="text"
                placeholder="Teléfono del Proveedor"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.direccion}
              />
            </div>
            {/* Fin Direccion */}

            {/* Email */}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
                {formik.touched.email && formik.errors.email ? (
                  <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p>
                      <span className="font-bold">Error: </span>
                      {formik.errors.email}
                    </p>
                  </Error>
                ) : null}
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Teléfono del Proveedor"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
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
                {formik.touched.categoria && formik.errors.categoria ? (
                  <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p>
                      <span className="font-bold">Error: </span>
                      {formik.errors.categoria}
                    </p>
                  </Error>
                ) : null}
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="categoria"
                type="text"
                placeholder="Teléfono del Proveedor"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.categoria}
              />
            </div>
            {/* Fin Categoría */}

            {/* Botones */}
            <R className="mt-5">
              <input
                type="submit"
                className="bg-green-500 mt-5 p-2 text-white rounded font-bold hover:bg-green-600"
                value="Agregar nuevo proveedor"
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
        </div>
      </Container>
    </Layout>
  );
};

export default NuevoProveedor;
