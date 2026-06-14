import { createConfig, http } from "wagmi";
import { hardhat, polygonAmoy } from "wagmi/chains";
import { metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors";

const isDev = process.env.NODE_ENV !== "production";

// Polygon Amoy (80002) is the active free Polygon testnet (Mumbai was sunset).
export const wagmiConfig = createConfig({
  chains: [isDev ? hardhat : polygonAmoy],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: "PropChain" }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
      showQrModal: true,
    }),
  ],
  transports: {
    [hardhat.id]:     http("http://127.0.0.1:8545"),
    [polygonAmoy.id]: http(
      process.env.NEXT_PUBLIC_AMOY_RPC_URL ??
        process.env.NEXT_PUBLIC_MUMBAI_RPC_URL ??
        "https://rpc-amoy.polygon.technology"
    ),
  },
  ssr: true,
});
