import { useEffect, useState, useCallback } from "react";
import { useCentrifuge } from "./useCentrifuge";
import { BidAskType } from "../types";
import { updateOrderBookItems } from "../utils/updateOrderBookItems";
import {
  PublicationContext,
  SubscribedContext,
  Subscription,
} from "centrifuge";

export const useOrderbook = (market: string) => {
  const { centrifuge } = useCentrifuge();

  const [bids, setBids] = useState<BidAskType>([]);
  const [asks, setAsks] = useState<BidAskType>([]);
  const [lastSequence, setLastSequence] = useState<number | null>(null);
  const [sub, setSub] = useState<Subscription | null>(null);

  const handlePublication = useCallback(
    (ctx: PublicationContext) => {
      if (!sub) return;
      // if (lastSequence && lastSequence + 1 !== ctx.data.lastSequence) {
      //   sub.unsubscribe();
      //   sub.removeAllListeners();
      //   setSub(null);
      // } else {
      //   setBids((bids) => updateOrderBookItems(bids, ctx.data.bids));
      //   setAsks((asks) => updateOrderBookItems(asks, ctx.data.asks));
      //   setLastSequence(ctx.data?.sequence);
      // }

      setBids((bids) => updateOrderBookItems(bids, ctx.data.bids));
      setAsks((asks) => updateOrderBookItems(asks, ctx.data.asks));
      setLastSequence(ctx.data?.sequence);
    },
    [sub]
  );

  const handleSubscription = useCallback((ctx: SubscribedContext) => {
    console.log("Subscribed", ctx);
    setBids(updateOrderBookItems(ctx.data?.bids, null));
    setAsks(updateOrderBookItems(ctx.data?.asks, null));
    setLastSequence(ctx.data.sequence);
  }, []);

  const subscribe = useCallback(() => {
    if (!centrifuge) return;

    if (!sub) {
      setSub(centrifuge.newSubscription(`orderbook:${market}`));
    } else {
      sub
        .on("publication", handlePublication)
        .on("subscribed", handleSubscription)
        .on("unsubscribed", function (ctx) {
          console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
        })
        .subscribe();
    }
  }, [centrifuge, handlePublication, handleSubscription, market, sub]);

  useEffect(() => {
    subscribe();

    return () => {
      sub?.unsubscribe();
      sub?.removeAllListeners();
    };
  }, [subscribe, sub]);

  return { bids, asks };
};
