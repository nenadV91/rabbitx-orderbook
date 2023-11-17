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

  const [needsReload, setNeedsReload] = useState<boolean>(false);
  const [lastSequence, setLastSequence] = useState<number | null>(null);

  const subscribe = useCallback(() => {
    if (!centrifuge) return;

    if (!sub) {
      setSub(centrifuge.newSubscription(`orderbook:${market}`));
    } else {
      sub
        .on("publication", (ctx) => {
          setBids((bids) => updateOrderBookItems(bids, ctx.data.bids));
          setAsks((asks) => updateOrderBookItems(asks, ctx.data.asks));
          setLastSequence((seq) => {
            // In case the new sequence from the api is not for 1 higher then last sequence we stored
            // We will force the re-subscription but setting needsReload state to true
            if (seq && ctx.data.sequence !== seq + 1) {
              setNeedsReload(true);
              return null;
            }

            return ctx.data.sequence;
          });
        })
        .on("subscribed", (ctx) => {
          console.log("Subscribed", ctx);
          setBids(updateOrderBookItems(ctx.data?.bids, null));
          setAsks(updateOrderBookItems(ctx.data?.asks, null));
          setLastSequence(ctx.data.sequence);
        })
        .on("unsubscribed", (ctx) => {
          console.log(`unsubscribed: ${ctx.code}, ${ctx.reason}`);
        })
        .subscribe();
    }
  }, [centrifuge, market, sub]);

  // Handle initial subscribe and clean up on unmount
  useEffect(() => {
    subscribe();

    return () => {
      sub?.unsubscribe();
      sub?.removeAllListeners();
    };
  }, [subscribe, sub]);

  // Observe and trigger new subscribe if needsReload is true
  useEffect(() => {
    if (needsReload) {
      // First unsubscribe and remove event listeners
      sub?.unsubscribe();
      sub?.removeAllListeners();

      // Subscribe again
      subscribe();

      // Return needsReload back to false
      setNeedsReload(false);
    }
  }, [subscribe, needsReload, sub]);

  // To test lastSequence issue uncomment this
  // It will mess up the lastSequence every 5s and force re-subscribe
  // useEffect(() => {
  //   setInterval(() => {
  //     console.log("Messing up last sequence");
  //     setLastSequence(1);
  //   }, 1000 * 5);
  // }, []);

  return { bids, asks, lastSequence };
};
