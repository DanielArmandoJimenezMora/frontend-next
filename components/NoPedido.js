import React from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

const NoPedido = () => {
  return (
    <div>
      <Player
        autoplay
        loop
        src="https://assets7.lottiefiles.com/packages/lf20_aBYmBC.json"
        style={{ height: "60vh", width: "100%" }}
      >
        <Controls visible={false} />
      </Player>
      <p className="text-center text-2xl">No se encontraron pedidos</p>
    </div>
  );
};

export default NoPedido;
