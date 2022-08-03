import React from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

const NoData = () => {
  return (
    <div>
      <Player
        autoplay
        loop
        src="https://assets4.lottiefiles.com/packages/lf20_qszkkg7n.json"
        style={{ height: "400px", width: "400px" }}
      >
        <Controls
          visible={false}
          buttons={["play", "repeat", "frame", "debug"]}
        />
      </Player>
      <p className="text-center text-2xl">No se encontraron resultados.</p>
    </div>
  );
};

export default NoData;
