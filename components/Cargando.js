import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import styled from "@emotion/styled";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

const ContainerPed = styled.div`
  padding-top: 17rem;
  height: 88vh;
`;

export default function Pedidos() {
  return (
    <div>
      <Layout>
        <ContainerPed className="mt-5">
          <Player
            autoplay
            loop
            /* src="https://assets7.lottiefiles.com/private_files/lf30_iijyd4u7.json" */
            src="https://assets7.lottiefiles.com/private_files/lf30_slenfa7o.json"
            style={{ height: "200px", width: "200px" }}
          >
            <Controls
              visible={false}
              buttons={["play", "repeat", "frame", "debug"]}
            />
          </Player>
        </ContainerPed>
      </Layout>
    </div>
  );
}
