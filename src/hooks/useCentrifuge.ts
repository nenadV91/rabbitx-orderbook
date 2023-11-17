import { Centrifuge } from "centrifuge";
import { useEffect, useState } from "react";
import { jwtToken, wsUrl } from "../constants";

export const useCentrifuge = () => {
  const [centrifuge, setCentrifuge] = useState<Centrifuge | null>(null);

  useEffect(() => {
    const _centrifuge = new Centrifuge(wsUrl, {
      token: jwtToken,
    });

    _centrifuge
      .on("connecting", function (ctx) {
        console.log(`connecting: ${ctx.code}, ${ctx.reason}`);
      })
      .on("connected", function (ctx) {
        console.log(`connected over ${ctx.transport}`);
      })
      .on("disconnected", function (ctx) {
        console.log(`disconnected: ${ctx.code}, ${ctx.reason}`);
      })
      .connect();

    setCentrifuge(_centrifuge);
  }, []);

  return { centrifuge };
};
