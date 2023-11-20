# React + TypeScript + Vite

### Demo

https://main--rabbitx.netlify.app/

## Approach taken

The app is structured in a following parts

- Containers - inside them we call hooks to create websocket connection and get the data
- Components - these are UI components that get get the data and render the UI
- Utils - these are functions that contain logic that can be separated from the hooks and/or re-used
- Hooks - they contain most of the logic for getting the websocket data and processing it

### Order-book flow

- The root of this is OrderBook container
- Inside we call useOrderbook hook to get the bid/ask data
- we take first n items of bids and last n of asks, calculate bar percentages and pass to UI components
- We also call useMarketPrice hoook to get price data

### useOrderbook hook

- This hook is responsible for creating a websocket connection to orderbook channel
- It will store bids/asks separatelly in state first on initial snapshot from subscribed event and then from the following publication updates
- It will aslo track lastSequence and if some publication has the wrong sequence number it will triger re-subscription and get the whole snapshot

### useMarketPrice hook

- similar structure to useOrderbook hook, but this one subscribes to market channel and returns the market data
- it will return last traded price, index price from the api, and also market price direction which is calculated based on previous last price

## Challenges faced

#### First challenge

- was optimizing hooks that do the websocket calls, so that they are called only when necessary and that there are no memory leaks and uncessary re-renders
- this was accomplished in few ways

  1.  by using current state variables from a callback function in "setState" methods, and not passing them as a hook dependencies
  2.  use using getSubscription method to check if there is already a subscription for that channel
  3.  by using "clear" function in useEffect hook to unsubscribe and removeAllListeners

#### Second challenge

- was figuring out how to handle updates from publication events for order-book, and how to store that data in a efficient but also practical way
- there are multiple approaches to storing bid/ask data such as
  1.  an object - where price is a key and amount is value. PRO for this is that data is efficiently updated in an object but a CON is that it needs to be converted later in the array and sorted before displaying
  2.  an array - where bid/ask are just arrays as we get it from the api. PRO of this is that data is easily usable for sorting and slicing but the CON is that its innefiction to update it as an array and search array instead of using an object
  3.  hybrid with array and object - with this approcah we combine array an object in a sense that we actually store it as an array but when we are updating it in the updateOrderBookItems.ts util file we convert the data to an object for faster lookup and then in the end we convert it back to an array.

## Possible improvements

- I feel like useOrderbook and useMarketPrice hooks are a bit too long and some parts can be extracted in separate parts and re-used
- Would be great to add unit tests to utils functions at least and maybe to hooks
- Create storybook for UI components for a previews and easier modification
- Of course, UI improvements, but that wasn't the focus here
