import { Centrifuge } from "centrifuge";
import { useEffect, useState } from "react";
import { OrderBookSideType } from "../types";
import { updateOrderBookSide } from "../utils/updateOrderBookSide";
import { parseApiItems } from "../utils/parseApiItems";

const {
  VITE_TEST_JWT_TOKEN,
  VITE_TEST_WS_URL,
  VITE_PROD_JWT_TOKEN,
  VITE_PROD_WS_URL,
} = import.meta.env;

const isProd = false;
const jwtToken = isProd ? VITE_PROD_JWT_TOKEN : VITE_TEST_JWT_TOKEN;
const wsUrl = isProd ? VITE_PROD_WS_URL : VITE_TEST_WS_URL;

export const useOrderbook = (market: string) => {
  const [bids, setBids] = useState<OrderBookSideType>({});
  const [asks, setAsks] = useState<OrderBookSideType>({});
  const [lastSequence, setLastSequence] = useState<number | null>(null);

  useEffect(() => {
    const centrifuge = new Centrifuge(wsUrl, {
      token: jwtToken,
    });

    centrifuge
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

    const sub = centrifuge.newSubscription(`orderbook:${market}`);

    sub
      .on("publication", function (ctx) {
        const { bids: newBids, asks: newAsks, sequence } = ctx.data;

        setBids((bids) => updateOrderBookSide(bids, newBids));
        setAsks((asks) => updateOrderBookSide(asks, newAsks));
        setLastSequence(sequence);
      })
      .on("subscribing", function (ctx) {
        console.log(`subscribing: ${ctx.code}, ${ctx.reason}`);
      })
      .on("subscribed", function (ctx) {
        const { bids, asks, sequence } = ctx.data;
        setBids(parseApiItems(bids));
        setAsks(parseApiItems(asks));
        setLastSequence(sequence);
      })
      .on("unsubscribed", function (ctx) {
        console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
      })
      .subscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [market]);

  return { bids, asks, lastSequence };
};
