import { Subscription } from "centrifuge";
import { useCentrifuge } from "./useCentrifuge";
import { useState, useCallback, useEffect, useMemo } from "react";

export enum MarketPriceDirection {
  UP = "UP",
  DOWN = "DOWN",
}

export const useMarketPrice = (market: string) => {
  const { centrifuge } = useCentrifuge();

  const [sub, setSub] = useState<Subscription | null>(null);
  const [lastTradedPrice, setLastTradedPrice] = useState<string | null>(null);
  const [indexPrice, setIndexPrice] = useState<string | null>(null);
  const [marketPriceDirection, setMarketPriceDirection] =
    useState<MarketPriceDirection | null>(null);

  const subscriptionString = useMemo(() => `market:${market}`, [market]);

  const subscribe = useCallback(() => {
    if (!centrifuge) return;

    if (!sub) {
      setSub(centrifuge.newSubscription(subscriptionString));
    } else {
      sub
        .on("publication", (ctx) => {
          const { last_trade_price, index_price } = ctx.data;

          // Update lastTradedPrice and marketPriceDirection if there is data from the API
          if (last_trade_price) {
            setLastTradedPrice((lastPrice) => {
              if (lastPrice) {
                setMarketPriceDirection(
                  // If new last_trade_price is bigger then last price set direction to UP, otherwise down
                  last_trade_price > lastPrice
                    ? MarketPriceDirection.UP
                    : MarketPriceDirection.DOWN
                );
              }

              return last_trade_price;
            });
          }

          // Update spotMarketPrice if there is data from the API
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
        })
        .subscribe();
    }
  }, [centrifuge, sub, subscriptionString]);

  // Handle initial subscribe and clean up on unmount
  useEffect(() => {
    subscribe();

    return () => {
      sub?.unsubscribe();
      sub?.removeAllListeners();
    };
  }, [sub, subscribe]);

  return { lastTradedPrice, indexPrice, marketPriceDirection };
};
