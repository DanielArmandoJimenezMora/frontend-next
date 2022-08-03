import React, { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import styled from "@emotion/styled";
import Image from "next/image";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import Swal from "sweetalert2";

/* Estilos */
/* Estilo para el background */
const Bgb = styled.div`
  background-image: linear-gradient(to top, #96e4de 0%, #fff 100%);
  height: 100vh;
`;

/* Estilo para Contenedor principal */
const LoginContainer = styled.div`
  height: 34.3em;
  width: 60em;
  margin: 7em auto;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  @media screen and (max-width: 1000px) {
    width: 70%;
    margin-top: 3em;
  }
`;

/* Estilo para  Contenedor de los datos */
const LoginInfoContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 0.5rem;
  background-color: #fff;
  border-radius: 0px 30px 30px 0px;
  @media screen and (max-width: 1000px) {
    width: 100%;
  }
`;

/* Estilos para Contenedor de la imagen */
const ImageContainer = styled.div`
  width: 50%;
  background-color: #fff;
  border-radius: 30px 0px 0px 30px;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

/* Estilo para Titulo del login */
const Title = styled.h1`
  text-transform: capitalize;
  font-size: 2.25rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: #108598;
  padding-top: 3rem;
  padding-bottom: 1rem;
`;

/* Estilo para el contenedor de los inputs */
const InputsContainer = styled.form`
  height: 70%;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

/* Estilo de inputs */
const Input = styled.input`
  width: 90%;
  height: 3.125rem;
  font-size: 1em;
  padding-left: 20px;
  border: none;
  border-radius: 5px;
  font-weight: 300;
  letter-spacing: 1px;
  box-sizing: border-box;
  &:hover {
    border: 2px solid #108598;
  }
`;

/* Estilo de select */
const Select = styled.select`
  width: 90%;
  height: 3.125rem;
  background-color: #fff;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  font-weight: 300;
  letter-spacing: 1px;
  box-sizing: border-box;
  &:hover {
    border: 2px solid #108598;
  }
`;

/* Estilo para que no se muestre un label */
const Label = styled.label`
  display: none;
`;

/* Estilo del boton */
const Btn = styled.input`
  width: 90%;
  height: 3.125rem;
  font-size: 1em;
  letter-spacing: 1px;
  color: #fff;
  border-radius: 5px;
  background-color: #108598;
  cursor: pointer;
  &:hover {
    background-color: #0f7d8e;
  }
`;

/* Estilo para el span */
const Span = styled.span`
  color: #108598;
  font-weight: 400px;
  cursor: pointer;
`;

/* Estilo para mostrar error en la validación */
const Error = styled.div`
  width: 90%;
  text-align: left;
  padding: 8px;
`;

/* Estilo para mostrar error en la autenticación */
const Error2 = styled.div`
  width: 90%;
  padding: 8px;
`;
/* Fin de estilos */

/* Mutation */
const NUEVA_CUENTA = gql`
  mutation nuevoUsuario($input: UsuarioInput) {
    nuevoUsuario(input: $input) {
      id
      nombre
      apellido
      genero
      email
    }
  }
`;

const NuevaCuenta = () => {
  //State para el mensaje
  const [mensaje, guardarMensaje] = useState(null);

  // Mutation para crear nuevos usuarios
  const [nuevoUsuario] = useMutation(NUEVA_CUENTA);

  // Router para redireccionar
  const router = useRouter();

  // Validación del formulario
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      genero: "",
      password: "",
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
    }),
    onSubmit: async (valores) => {
      const { nombre, apellido, genero, email, password } = valores;
      try {
        const { data } = await nuevoUsuario({
          variables: {
            input: {
              nombre,
              apellido,
              genero,
              email,
              password,
            },
          },
        });
        // Usuario creado correctamente
        guardarMensaje("Se creó correctamente el Usuario");
        setTimeout(() => {
          guardarMensaje(null);
          confirmar();
          router.push("/login");
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

  const mostrarMensaje = () => {
    return mensaje === "Se creó correctamente el Usuario" ? (
      <Error2 className="py-2 px-3 w-full my-3 max-w-sm text-center mx-auto bg-green-100 border-l-4 border-green-500 text-green-700">
        <p>{mensaje}</p>
      </Error2>
    ) : (
      <Error2 className="py-2 px-3 w-full my-3 max-w-sm text-center mx-auto bg-red-100 border-l-4 border-red-500 text-red-700">
        <p>{mensaje}</p>
      </Error2>
    );
  };

  const confirmar = () => {
    Swal.fire("!Usuario creado exitosamente!", "", "success");
  };

  return (
    <Layout>
      <Bgb>
        <LoginContainer>
          <ImageContainer>
            <Image width={457} height={551} src="/img/lobo.png" />
          </ImageContainer>
          <LoginInfoContainer>
            <Title>Crear Nueva Cuenta</Title>
            {/* Form */}
            <InputsContainer onSubmit={formik.handleSubmit}>
              {/* Campo Nombre */}
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                className="focus:outline-none focus:shadow-outline"
                id="nombre"
                type="text"
                placeholder="Nombre Usuario"
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.nombre && formik.errors.nombre ? (
                <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>
                    <span className="font-bold">Error: </span>
                    {formik.errors.nombre}
                  </p>
                </Error>
              ) : null}

              {/* Campo Apellido */}
              <Label htmlFor="nombre">Apellido</Label>
              <Input
                className="focus:outline-none focus:shadow-outline"
                id="apellido"
                type="text"
                placeholder="Apellido Usuario"
                value={formik.values.apellido}
                onChange={formik.handleChange}
              />
              {formik.touched.apellido && formik.errors.apellido ? (
                <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>
                    <span className="font-bold">Error: </span>
                    {formik.errors.apellido}
                  </p>
                </Error>
              ) : null}

              {/* Campo Genero */}
              <Select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="genero"
                value={formik.values.genero}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="" label="Selecciona un genero">
                  Selecciona un genero{" "}
                </option>
                <option value="Hombre" label="Hombre">
                  {" "}
                  Hombre
                </option>
                <option value="Mujer" label="Mujer">
                  Mujer
                </option>
                <option value="Otro" label="Otro">
                  Otro
                </option>
              </Select>

              {/* Campo Email */}
              <Label htmlFor="nombre">Correo</Label>
              <Input
                className="focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Correo"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
              {formik.touched.email && formik.errors.email ? (
                <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>
                    <span className="font-bold">Error: </span>
                    {formik.errors.email}
                  </p>
                </Error>
              ) : null}
              {/* Campo Password */}
              <Label htmlFor="password">Password</Label>
              <Input
                className="focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Contraseña"
                value={formik.values.password}
                onChange={formik.handleChange}
              />
              {formik.touched.password && formik.errors.password ? (
                <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>
                    <span className="font-bold">Error: </span>
                    {formik.errors.password}
                  </p>
                </Error>
              ) : null}
              <Btn type="submit" value="Crear cuenta" />
              {mensaje && mostrarMensaje()}
              <Link href="/login">
                <a>
                  <p>
                    Ya tienes cuenta? <Span>Iniciar sesión</Span>
                  </p>
                </a>
              </Link>
            </InputsContainer>
          </LoginInfoContainer>
        </LoginContainer>
      </Bgb>
    </Layout>
  );
};

export default NuevaCuenta;
