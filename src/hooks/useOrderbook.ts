import { useEffect, useState, useCallback } from "react";
import { Subscription } from "centrifuge";
import { useCentrifuge } from "./useCentrifuge";
import { updateOrderBookItems } from "../utils/updateOrderBookItems";
import { BidAskType } from "../types";

export const useOrderbook = (market: string) => {
  const { centrifuge } = useCentrifuge();

  const [bids, setBids] = useState<BidAskType>([]);
  const [asks, setAsks] = useState<BidAskType>([]);
  const [sub, setSub] = useState<Subscription | null>(null);

  const subscribe = useCallback(() => {
    if (!centrifuge) return;

    if (!sub) {
      setSub(centrifuge.newSubscription(`orderbook:${market}`));
    } else {
      sub
        .on("publication", (ctx) => {
          setBids((bids) => updateOrderBookItems(bids, ctx.data.bids));
          setAsks((asks) => updateOrderBookItems(asks, ctx.data.asks));
        })
        .on("subscribed", (ctx) => {
          console.log("Subscribed", ctx);
          setBids(updateOrderBookItems(ctx.data?.bids, null));
          setAsks(updateOrderBookItems(ctx.data?.asks, null));
        })
        .on("unsubscribed", (ctx) => {
          console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
        })
        .subscribe();
    }
  }, [centrifuge, market, sub]);

  useEffect(() => {
    subscribe();

    return () => {
      sub?.unsubscribe();
      sub?.removeAllListeners();
    };
  }, [subscribe, sub]);

  return { bids, asks };
};
