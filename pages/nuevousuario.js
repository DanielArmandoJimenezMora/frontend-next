import React, { useState } from "react";
import Layout from "../components/Layout";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import Swal from "sweetalert2";
import styled from "@emotion/styled";
import Cargando from "../components/Cargando";
import NoSesion from "../components/NoSesion";

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
  height: 83vh;
  border-radius: 10px !important;
  background-color: #fff;
`;
/* Fin estilos */

/* GraphQL */
const NUEVA_CUENTA = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
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

const NuevoUsuario = () => {
  const router = useRouter();
  const [mensaje, guardarMensaje] = useState(null);
  const [nuevoUsuario] = useMutation(NUEVA_CUENTA);
  const { data, loading, client } = useQuery(OBTENER_CLIENTES_USUARIO);
  const [ver, setVer] = useState(false);
  let see = "";
  if (ver === false) {
    see = "password";
  } else see = "text";

  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      genero: "",
      password: "",
      perfil: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatoro"),
      apellido: Yup.string().required("El apellido es obligatorio"),
      genero: Yup.string().required("El genero es obligatorio"),
      email: Yup.string()
        .email("El email no es válido")
        .required("El email es obligatorio"),
      password: Yup.string()
        .required("La contraseña es obligatoria")
        .min(6, "La contraseña debe tener al menos 6 caracteres"),
      perfil: Yup.string().required("El tipo de cuenta es obligatorio"),
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, genero, email, password, perfil } = valores;
      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              genero,
              email,
              password,
              perfil,
            },
          },
        });
        // Usuario creado correctamente
        guardarMensaje("Se creó correctamente el Usuario");
        setTimeout(() => {
          guardarMensaje(null);
          confirmar();
          router.push("/usuarios");
        }, 1500);

        //Redirigir al usuario para iniciar sesión
      } catch (error) {
        guardarMensaje(error.message.replace("GraphQL error: ", ""));
        setTimeout(() => {
          guardarMensaje(null);
        }, 1500);
      }
    },
  });

  const confirmar = () => {
    Swal.fire("!Usuario creado exitosamente!", "", "success");
  };

  const mostrar = () => {
    if (ver === true) {
      setVer(false);
    } else {
      setVer(true);
    }
  };

  if (loading) return <Cargando />;

  if (!data.obtenerClientesVendedor) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">
        Registrar nuevo usuario
      </h1>
      <hr />

      <Container className="overflow-x-scroll shadow-md mt-3">
        <div className="">
          <form
            className="bg-white px-8 pt-6 pb-8 mb-4"
            onSubmit={formik.handleSubmit}
          >
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
                placeholder="Nombre Usuario"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.nombre}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Apellido
              </label>

              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="apellido"
                type="text"
                placeholder="Apellido Usuario"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.apellido}
              />
            </div>

            <div className="mb-4">
              <Obligatorio>*</Obligatorio> Género
              <Select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="genero"
                value={formik.values.genero}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
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
                <option value="Otro" label="Otro">
                  {" "}
                  Otro
                </option>
              </Select>
            </div>

            <div className="mb-4">
              <Obligatorio>*</Obligatorio> Tipo de cuenta
              <Select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="perfil"
                value={formik.values.perfil}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Selecciona un tipo de usuario">
                  Selecciona un tipo de usuario{" "}
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

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                <Obligatorio>*</Obligatorio> Correo Electrónico
              </label>
              {formik.touched.email && formik.errors.email ? (
                <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>
                    <span className="font-bold">Error: </span>
                    {formik.errors.email}
                  </p>
                </Error>
              ) : null}
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Correo electrónico del Usuario"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>

            <div className="mb-4">
              <div className="flex">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  <Obligatorio>*</Obligatorio> Password
                </label>
                <span
                  className="ml-2 text-slate-500 cursor-pointer"
                  onClick={mostrar}
                >
                  {ver === false ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                        clipRule="evenodd"
                      ></path>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </span>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>
                    <span className="font-bold">Error: </span>
                    {formik.errors.password}
                  </p>
                </Error>
              ) : null}
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type={see}
                placeholder="Contraseña del usuario"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>

            <R className="mt-5">
              <input
                type="submit"
                className="bg-green-500 mt-5 p-2 text-white rounded font-bold hover:bg-green-600"
                value="Registrar"
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
        </div>
      </Container>
    </Layout>
  );
};

export default NuevoUsuario;
