import React from "react";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

const NoSesion = () => {
  return (
    <div className="bg-black">
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
    </div>
  );
};

export default NoSesion;
