import { createConfig, http } from "wagmi";
import { hardhat, polygonMumbai } from "wagmi/chains";
import { metaMask, coinbaseWallet, walletConnect } from "wagmi/connectors";

const isDev = process.env.NODE_ENV !== "production";

export const wagmiConfig = createConfig({
  chains: [isDev ? hardhat : polygonMumbai],
  connectors: [
    metaMask(),
    coinbaseWallet({ appName: "PropChain" }),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
      showQrModal: true,
    }),
  ],
  transports: {
    [hardhat.id]:       http("http://127.0.0.1:8545"),
    [polygonMumbai.id]: http(process.env.NEXT_PUBLIC_MUMBAI_RPC_URL ?? ""),
  },
  ssr: true,
});
