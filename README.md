# SPL Token Balance Reader

## How to run the program
1. In the root of the project directory, run: 
### `npm start`
2. In the server directory, start the server:
### `node server.js` 

Note: The server is used to query the CoinMarketCap API to get the latest price of Solana. If this is not needed (my API key has limited credits), you do not need to start the server and the Solana balance will show up as $0.00. 

The program will open in the browser at [http://localhost:3000](http://localhost:3000).

3. This is the wallet address I used for most of my testing:
### `26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo`

## Features

### Displays the Solana balance and all token balances belonging to specified wallet address 

- Users can input a Solana address. If the address is valid, the relevant balances will appear. If the address is NOT valid, an error message will appear. 
- The Solana balance comes with the USD equivalent. 
- The token cards display the name, balance, and symbol of the token. 
- The token list updates live as the address in the input changes. 

### Can toggle between networks (mainnet-beta / devnet / testnet) and see which tokens exist in each
- The Solana balance is queried from mainnet-beta and will only show up under mainnet-beta.
- Relevant tokens in each network will display when you toggle between networks.

### Can easily connect to and disconnect from Phantom wallet

## Implementation decisions

### Using Chakra UI
- I've used Chakra UI a bit before and liked how I could align things easily using specialized components like `<Flex>` (acts like a flex box), `<HStack>` and `<VStack>` (act like a horizontal stack and vertical stack, respectively), etc. I used this library to abstract some of that away and not worry about CSS too much in my limited time.

### Using `findAssociatedTokenAddress` endpoint and displaying text to indicate that some token accounts belong to the same mint 
- I noticed that there are a few program accounts with the same mint address so they appear to be duplicate tokens in the token list. 
 - Because of this, I kept track [associatedTokenAddress](https://spl.solana.com/associated-token-account) instead of mint address under the hood. This can be seen in my tokenMap and final tokenList object. 
   - According to the documentation, "This program introduces a way to deterministically derive a token account key from a user's main System account address and a token mint address, allowing the user to create a main token account for each token he owns."
- I displayed the multiple program accounts because they are still valid program accounts. However, I added a prop indicating that there are multiple accounts associated with that mint address.

### Combining token data from Solana's token registry with program account data from `getProgramAccounts`
- I used [Solana's token registry](https://github.com/solana-labs/token-list) to get metadata such as icon image for each token. I created a mapping from associatedAccountAddress to token object to make it easy to look up a specific token.
- While the token registry had relevant token metadata, each program account had information about tokenAmount. I combined both objects and created a new TokenType with fields I needed from both places. 
 - This was more intuitive for me than using the [`getTokenAccountsByOwner`](https://docs.solana.com/developing/clients/jsonrpc-api#gettokenaccountsbyowner) endpoint which requires a mint address parameter for each token.

### Hiding tokens that are not in Solana's token registry
- In my implementation, there are tokens that are not in Solana's token registry that only have an account address and a balance. For now, I did not display these tokens but I considered creating a new component for these "undefined tokens."
  - In `src/utils.ts`, you can see this undefined token list by uncommenting my console log on line 185.

### Creating a separate component for Solana balance
- I wanted to style Solana differently than the other token cards (I didn't get to this) and make sure it was the first balance shown by placing its component before the other tokens. 
- By separating Solana, it was easier to show/hide the Solana component depending on what network the user selects. The Solana balance is queried from mainnet-beta and will only show up under mainnet-beta.  

### Setting up a server to use CoinMarketCap API
- Avoid CORS errors.

## If I had more time
This project definitely has its flaws and limitations but I had a lot of fun along the way!

If I had more time, I would focus on:
1. More thorough testing and mocking fetches
2. More responsive styling for different breakpoints and browsers
3. More thorough TypeScript typing 
4. Refactoring code and moving hard-coded constants into shared variables
5. A way to filter or search for tokens
6. More information about each token when you click on individual token cards

## Thank you Phantom team! :)
