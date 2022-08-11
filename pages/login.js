import React, { useState } from "react";
import Layout from "../components/Layout";
import styled from "@emotion/styled";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

/* GraphQL */
const AUTENTICAR_USUARIO = gql`
  mutation autenticarUsuario($input: AutenticarInput) {
    autenticarUsuario(input: $input) {
      token
    }
  }
`;

/* Estilos */
const Bgb2 = styled.div`
  background-image: linear-gradient(to top, #96e4de 0%, #fff 100%);
  height: 100vh;
  display: flex;
`;
const Bgb = styled.div`
  background: url("/img/bg.jpeg");
  height: 100vh;
  display: flex;
`;

const LogoResponsive = styled.div`
  display: none;
  @media screen and (max-width: 1000px) {
    display: block;
    margin-top: 2rem;
  }
`;

const LoginContainer = styled.div`
  height: 34em;
  width: 57em;
  margin: auto;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  @media screen and (max-width: 1000px) {
    width: 90%;
    height: 40rem;
  }
`;

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

const ImageContainer = styled.div`
  width: 50%;
  background-color: #fff;
  border-radius: 30px 0px 0px 30px;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const Title = styled.h1`
  text-transform: capitalize;
  font-size: 2.25rem;
  font-weight: 300;
  letter-spacing: 1px;
  color: #108598;
  padding-top: 4rem;
  padding-bottom: 2rem;
  @media screen and (max-width: 1000px) {
    padding-top: 0px;
    margin-bottom: -1rem;
  }
`;

const InputsContainer = styled.form`
  height: 55%;
  width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

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

const Label = styled.label`
  display: none;
`;

const Btn = styled.button`
  width: 90%;
  height: 3.125rem;
  font-size: 1em;
  letter-spacing: 1px;
  color: #fff;
  background-color: #108598 !important;
  border: solid 1px #108598;
  border-radius: 6px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  &:hover {
    background-color: #0f7d8e;
    font-size: 1.2em;
  }
`;

const Modal = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  position: absolute;
  top: 0;
  margin: auto;
`;

const Load = styled.div`
  width: 30rem;
  height: 20rem;
  margin: 0 auto;
  margin-top: 14rem;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 0.5rem;
  border-radius: 0px 30px 30px 0px;
`;

const Error = styled.div`
  width: 85%;
  padding: 0px;
  padding-left: 20px;
  text-align: left;
  border-radius: 6px;
  border-left: 4px solid rgb(220 38 38);
  background-color: rgb(254 202 202);
  color: rgb(220 38 38); ;
`;

const Success = styled.div`
  width: 90%;
  padding: 0px;
  text-align: center;
  border-radius: 6px;
  border-left: 4px solid rgb(34 197 94);
  border-right: 4px solid rgb(34 197 94);
  background-color: rgb(187 247 208);
  color: rgb(34 197 94);
`;

/* Fin Estilos */

const Login = () => {
  //Routing
  const router = useRouter();

  const [mensaje, guardarMensaje] = useState(null);
  const [login, getLogin] = useState(false);

  // Mutations para crear nuevos usuarios en apollo
  const [autenticarUsuario] = useMutation(AUTENTICAR_USUARIO);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("El email no es valido")
        .required("El email no puede ir vacío"),
      password: Yup.string().required("El password es obligatoro"),
    }),
    onSubmit: async (valores) => {
      const { email, password } = valores;

      try {
        const { data } = await autenticarUsuario({
          variables: {
            input: {
              email,
              password,
            },
          },
        });
        console.log(data);
        guardarMensaje("Autenticando...");
        getLogin(true);

        // Guardar el token en localstorage
        setTimeout(() => {
          const { token } = data.autenticarUsuario;
          localStorage.setItem("token", token);
        }, 500);

        //Redireccionar a clientes

        setTimeout(() => {
          guardarMensaje(null);
          router.push("/pedidos");
        }, 4000);
      } catch (error) {
        guardarMensaje(error.message.replace("GraphQL error: ", ""));

        setTimeout(() => {
          guardarMensaje(null);
        }, 3000);
      }
    },
  });

  const mostrarMensaje = () => {
    return mensaje === "Autenticando..." ? (
      <Success className="py-2 px-3 w-full my-3 max-w-sm text-center mx-auto bg-green-100 border-l-4 border-green-500 text-green-700">
        <p>{mensaje}</p>
      </Success>
    ) : (
      <Error className="py-2 px-3 w-full my-3 max-w-sm text-center mx-auto bg-red-100 border-l-4 border-red-500 text-red-700">
        <p>{mensaje}</p>
      </Error>
    );
  };

  return (
    <Layout>
      <Bgb>
        <LoginContainer>
          <ImageContainer>
            <Image width={457} height={551} src="/img/lobo.png" />
          </ImageContainer>
          <LoginInfoContainer>
            <LogoResponsive>
              <Image width={120} height={120} src="/icon-192x192.png" />
            </LogoResponsive>
            <Title>Iniciar sesión</Title>
            <InputsContainer onSubmit={formik.handleSubmit}>
              <Label htmlFor="nombre">Usuario</Label>
              <Input
                className="focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Correo:"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>
                    <span className="font-bold">Error: </span>
                    {formik.errors.email}
                  </p>
                </Error>
              ) : null}
              <Label htmlFor="password">Password</Label>
              <Input
                className="focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="Contraseña"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <Error className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>
                    <span className="font-bold">Error: </span>
                    {formik.errors.password}
                  </p>
                </Error>
              ) : null}
              <Btn type="submit" value="Iniciar sesión">
                Ingresar
              </Btn>
              {mensaje && mostrarMensaje()}
              {/*  <Link href="/nuevacuenta">
                <a>
                  <p>
                    ¿No tienes cuenta? <Span>Registrarse</Span>
                  </p>
                </a>
              </Link> */}
            </InputsContainer>
          </LoginInfoContainer>
        </LoginContainer>
      </Bgb>
      {login === true ? (
        <Modal>
          <Load>
            <Player
              autoplay
              loop
              src="https://assets8.lottiefiles.com/packages/lf20_qf1pt6ua.json"
              style={{ height: "300px", width: "300px" }}
            >
              <Controls
                visible={false}
                buttons={["play", "repeat", "frame", "debug"]}
              />
            </Player>
          </Load>
        </Modal>
      ) : null}
    </Layout>
  );
};

export default Login;
