import { useEffect, useState, useCallback, useMemo } from "react";
import { Subscription } from "centrifuge";
import { useCentrifuge } from "./useCentrifuge";
import { updateOrderBookItems } from "../utils/updateOrderBookItems";
import { BidAskType } from "../types";

export const useOrderbook = (market: string) => {
  const { centrifuge } = useCentrifuge();

  const [bids, setBids] = useState<BidAskType>([]);
  const [asks, setAsks] = useState<BidAskType>([]);

  const [needsReload, setNeedsReload] = useState<boolean>(false);
  const [lastSequence, setLastSequence] = useState<number | null>(null);

  const subscriptionString = useMemo(
    () => market && `orderbook:${market}`,
    [market]
  );

  const handleSubscription = useCallback(
    (subscription: Subscription) => {
      subscription
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
          console.log(`Subscribed to ${subscriptionString}`, ctx);
          setBids(updateOrderBookItems(ctx.data?.bids, null));
          setAsks(updateOrderBookItems(ctx.data?.asks, null));
        })
        .on("unsubscribed", (ctx) => {
          console.log(
            `Unsubscribed from ${subscriptionString}, ${ctx.code}, ${ctx.reason}`
          );
        });
    },
    [subscriptionString]
  );

  const subscribeToOrderbook = useCallback(
    (subscriptionString: string) => {
      if (!centrifuge) return;

      // Check if a subscription already exists for this market
      let subscription = centrifuge.getSubscription(subscriptionString);

      if (!subscription) {
        // Create a new subscription if it doesn't exist
        subscription = centrifuge.newSubscription(subscriptionString);
      }

      // Attach handlers and subscribe
      handleSubscription(subscription);
      subscription.subscribe();
    },
    [centrifuge, handleSubscription]
  );

  // Effect to handle market changes
  useEffect(() => {
    if (!subscriptionString || !centrifuge) return;

    // Subscribe to the new market
    subscribeToOrderbook(subscriptionString);

    // Cleanup function to unsubscribe and remove listeners
    return () => {
      const subscription = centrifuge.getSubscription(subscriptionString);
      if (subscription) {
        subscription.unsubscribe();
        subscription.removeAllListeners();
      }
    };
  }, [subscribeToOrderbook, centrifuge, subscriptionString]);

  // Observe and trigger new subscribe if needsReload is true
  useEffect(() => {
    if (needsReload && centrifuge) {
      const subscription = centrifuge.getSubscription(subscriptionString);

      // First unsubscribe and remove event listeners
      subscription?.unsubscribe();
      subscription?.removeAllListeners();

      // Subscribe again
      subscribeToOrderbook(subscriptionString);

      // Return needsReload back to false
      setNeedsReload(false);
    }
  }, [centrifuge, needsReload, subscribeToOrderbook, subscriptionString]);

  // To test lastSequence issue uncomment this
  // It will mess up the lastSequence every 5s and force re-subscribe
  // Re-subscribe will fetch initial snapshot and update the data
  // useEffect(() => {
  //   setInterval(() => {
  //     console.log("Messing up last sequence");
  //     setLastSequence(1);
  //   }, 1000 * 5);
  // }, []);

  return { bids, asks, lastSequence };
};
