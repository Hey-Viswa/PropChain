import { useAccount, useConnect, useDisconnect } from "wagmi";
import { metaMask } from "wagmi/connectors";

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const connect = async () => {
    await connectAsync({ connector: metaMask() });
  };

  const truncatedAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : null;

  const isCorrectNetwork = chain?.id === 80001 || chain?.id === 31337; // Polygon Mumbai or Localhost

  return {
    address,
    isConnected,
    connect,
    disconnect,
    truncatedAddress,
    isCorrectNetwork,
    chain,
  };
}