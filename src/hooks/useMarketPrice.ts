import { useState, useCallback, useEffect, useMemo } from "react";
import { Subscription } from "centrifuge";
import { useCentrifuge } from "./useCentrifuge";
import { MarketPriceDirection } from "../types";

export const useMarketPrice = (market: string) => {
  const { centrifuge } = useCentrifuge();

  const [lastTradedPrice, setLastTradedPrice] = useState<string | null>(null);
  const [indexPrice, setIndexPrice] = useState<string | null>(null);
  const [marketPriceDirection, setMarketPriceDirection] =
    useState<MarketPriceDirection | null>(null);

  const subscriptionString = useMemo(
    () => market && `market:${market}`,
    [market]
  );

  const handleSubscription = useCallback(
    (subscription: Subscription) => {
      subscription
        .on("publication", (ctx) => {
          const { last_trade_price, index_price } = ctx.data;

          if (last_trade_price) {
            setLastTradedPrice((lastPrice) => {
              if (lastPrice) {
                setMarketPriceDirection(
                  last_trade_price > lastPrice
                    ? MarketPriceDirection.UP
                    : MarketPriceDirection.DOWN
                );
              }
              return last_trade_price;
            });
          }

          if (index_price) {
            setIndexPrice(index_price);
          }
        })
        .on("subscribed", (ctx) => {
          console.log(`Subscribed to ${subscriptionString}`, ctx);
          setLastTradedPrice(ctx.data.last_trade_price);
          setIndexPrice(ctx.data.index_price);
        })
        .on("unsubscribed", (ctx) => {
          console.log(
            `Unsubscribed from ${subscriptionString}, ${ctx.code}, ${ctx.reason}`
          );
        });
    },
    [subscriptionString]
  );

  const subscribeToMarket = useCallback(
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

  // Effect to handle market changes and subscription management
  useEffect(() => {
    if (!subscriptionString || !centrifuge) return;

    subscribeToMarket(subscriptionString);

    return () => {
      const subscription = centrifuge.getSubscription(subscriptionString);
      if (subscription) {
        subscription.unsubscribe();
        subscription.removeAllListeners();
      }
    };
  }, [subscribeToMarket, subscriptionString, centrifuge]);

  return { lastTradedPrice, indexPrice, marketPriceDirection };
};
