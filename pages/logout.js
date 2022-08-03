import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import styled from "@emotion/styled";
import { useQuery, gql } from "@apollo/client";
import { useRouter } from "next/router";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import NoSesion from "../components/NoSesion";

/* GraphQL */
const OBTENER_USUARIO = gql`
  query obtenerUsuario {
    obtenerUsuario {
      id
      nombre
      apellido
    }
  }
`;

const ContainerPed = styled.div`
  padding-top: 10rem;
  height: 88vh;
`;
const Modal = styled.div`
  width: 131%;
  height: 110%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  position: absolute;
  top: 0;
  left: -10rem;
`;

const Load = styled.div`
  width: 100%;
  margin-top: 10rem;
  display: flex;
  position: absolute;
  flex-direction: column;
  align-items: center;
`;
export default function Pedidos() {
  const router = useRouter();
  // Querty Apollo
  const { data, loading, client } = useQuery(OBTENER_USUARIO);

  // Proteger que no se acceda a data antes de obtener resultados
  if (loading)
    return (
      <Player
        autoplay
        loop
        src="https://assets5.lottiefiles.com/packages/lf20_ako6sbhy.json"
        style={{ height: "100%", width: "100%" }}
      >
        <Controls
          visible={false}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
    );

  if (!data.obtenerUsuario) {
    client.clearStore();
    router.push("/login");
    return <NoSesion />;
  }

  const { nombre, apellido } = data.obtenerUsuario;

  const cerrarSesion = () => {
    setTimeout(() => {
      localStorage.removeItem("token");
      client.clearStore();
      router.push("/login");
      return <p>Cargando...</p>;
    }, 3200);
  };
  return (
    <div>
      <Layout>
        <ContainerPed className="mt-5">
          <Modal>
            <Load>
              <Player
                autoplay
                loop
                src="https://assets1.lottiefiles.com/packages/lf20_urgxqz4c.json"
                style={{ height: "500px", width: "500px" }}
              >
                <Controls
                  visible={false}
                  buttons={["play", "repeat", "frame", "debug"]}
                />
              </Player>
              <p className="text-center text-2xl text-white">
                Hasta pronto {nombre} {apellido}{" "}
              </p>
            </Load>
          </Modal>
        </ContainerPed>
      </Layout>
      {cerrarSesion()}
    </div>
  );
}
