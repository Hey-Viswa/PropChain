import { createConfig, http } from "wagmi";
import { localhost, polygonMumbai } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [localhost, polygonMumbai],
  connectors: [metaMask()],
  transports: {
    [localhost.id]: http("http://127.0.0.1:8545"),
    [polygonMumbai.id]: http(process.env.NEXT_PUBLIC_MUMBAI_RPC_URL),
  },
});
