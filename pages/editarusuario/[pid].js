import React, { useState } from "react";
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
const OBTENER_USUARIO = gql`
  query obtenerUsuarioById($id: ID!) {
    obtenerUsuarioById(id: $id) {
      id
      nombre
      apellido
      genero
      email
      perfil
      password
    }
  }
`;

const ACTUALIZAR_USUARIO = gql`
  mutation actualizarUsuario($id: ID!, $input: UsuarioInput) {
    actualizarUsuario(id: $id, input: $input) {
      id
      nombre
      apellido
      email
      genero
      perfil
      password
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

const EditarUsuario = () => {
  const router = useRouter();
  const [ver, setVer] = useState(false);
  const {
    query: { pid },
  } = router;
  let id = pid;
  let see = "";
  if (ver === false) {
    see = "password";
  } else see = "text";

  /* Consultar para obtener el usuario */
  const { data, loading, error, client } = useQuery(OBTENER_USUARIO, {
    variables: { id },
  });
  const datosC = useQuery(OBTENER_CLIENTES_USUARIO);
  const dataC = datosC.data;
  const loadingC = datosC.loading;

  // Mutation para modificar el usuario
  const [actualizarUsuario] = useMutation(ACTUALIZAR_USUARIO);

  // Schema de validación
  const schemaValidation = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    apellido: Yup.string().required("El apellido es obligatorio"),
    email: Yup.string()
      .email("El email no es válido")
      .required("El email es obligatorio"),
    genero: Yup.string().required("El género es obligatorio"),
    perfil: Yup.string().required("El perfil es obligatorio"),
    password: Yup.string().required("La contraseña es obligatoria"),
  });

  const mostrar = () => {
    if (ver === true) {
      setVer(false);
    } else {
      setVer(true);
    }
  };

  if (loading || loadingC) return <Cargando />;

  if (!data) {
    return (id) => {
      Router.push({
        pathname: "/editarusuario/[id]",
        query: { id },
      });
    };
  }

  if (!dataC.obtenerClientesVendedor) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  const { obtenerUsuarioById } = data;

  const actualizarInfoUsuario = async (valores) => {
    const { nombre, apellido, email, genero, perfil, password } = valores;
    try {
      const { data } = await actualizarUsuario({
        variables: {
          id,
          input: {
            nombre,
            apellido,
            email,
            genero,
            perfil,
            password,
          },
        },
      });

      // Mostrar una alerta
      Swal.fire(
        "Actualizado!",
        "El usuario se actualizó correctamente",
        "success"
      );
      router.push("/usuarios");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar Usuarios</h1>
      <br />
      <hr />

      <Container className="overflow-x-scroll mt-3">
        <div className="">
          <Formik
            validationSchema={schemaValidation}
            enableReinitialize
            initialValues={obtenerUsuarioById}
            onSubmit={async (valores) => {
              actualizarInfoUsuario(valores);
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
                      placeholder="Nombre del usuario"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.nombre}
                    />
                  </div>
                  {/* Fin Nombre */}

                  {/* Apellido */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="apellido"
                    >
                      Apellido
                      {props.touched.apellido && props.errors.apellido ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.apellido}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="apellido"
                      type="text"
                      placeholder="Apellido del usuario"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.apellido}
                    />
                  </div>
                  {/* Fin Apellido */}

                  {/* Genero */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="genero"
                    >
                      <Obligatorio>*</Obligatorio> Género
                      {props.touched.genero && props.errors.genero ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.genero}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <Select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="genero"
                      value={props.values.genero}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    >
                      <option value="" label="Selecciona un género">
                        Selecciona un género{" "}
                      </option>
                      <option value="Hombre" label="Hombre">
                        {" "}
                        Hombre
                      </option>
                      <option value="Mujer" label="Mujer">
                        {" "}
                        Mujer
                      </option>
                    </Select>
                  </div>
                  {/* Fin de Género */}

                  {/* Perfil */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="perfil"
                    >
                      <Obligatorio>*</Obligatorio> Prerfil del usuario
                      {props.errors.perfil ? (
                        <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                          <p>
                            <span className="font-bold">Error: </span>
                            {props.errors.perfil}
                          </p>
                        </Error>
                      ) : null}
                    </label>

                    <Select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      name="perfil"
                      value={props.values.perfil}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    >
                      <option value="" label="Selecciona el tipo de cuenta">
                        Selecciona un tipo de cuenta{" "}
                      </option>
                      <option value="Administrador" label="Administrador">
                        {" "}
                        Administrador
                      </option>
                      <option value="Vendedor" label="Vendedor">
                        {" "}
                        Vendedor
                      </option>
                    </Select>
                  </div>
                  {/* Fin de perfil */}

                  {/* Email */}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="email"
                    >
                      <Obligatorio>*</Obligatorio> Email
                      {props.touched.email && props.errors.existencia ? (
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
                      placeholder="Email del usuario"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.email}
                    />
                  </div>
                  {/* Fin de Email */}

                  {/* Contraseña */}
                  <div className="mb-4">
                    <div className="flex">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="password"
                      >
                        <Obligatorio>*</Obligatorio> Contraseña del usuario{" "}
                        {props.errors.password ? (
                          <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p>
                              <span className="font-bold">Error: </span>
                              {props.errors.password}
                            </p>
                          </Error>
                        ) : null}
                      </label>
                      <span
                        className="ml-2 text-slate-500 cursor-pointer"
                        onClick={mostrar}
                      >
                        {ver === false ? (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                            <path
                              /* fill-rule="evenodd" */
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              /* clip-rule="evenodd" */
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              /* fill-rule="evenodd" */
                              d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                              /* clip-rule="evenodd" */
                            ></path>
                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                          </svg>
                        )}
                      </span>
                    </div>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type={see}
                      placeholder="Contraseña del usuario"
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={props.values.password}
                    />
                  </div>
                  {/* Fin de Contraseña */}

                  {/* Botones */}
                  <R>
                    <input
                      type="submit"
                      className="bg-green-500 mt-5 p-2 text-white rounded font-bold hover:bg-green-600"
                      value="Guardar Cambios"
                    />
                    <Link href="/usuarios">
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

export default EditarUsuario;
