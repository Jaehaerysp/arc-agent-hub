export const ARC_TESTNET = {
  chainId: "0x4CF092",
  chainName: "Arc Testnet",
  rpcUrls: ["https://rpc.testnet.arc.network"],
  nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
  blockExplorerUrls: ["https://testnet.arcscan.app"],
};

export const CHAIN_ID = 5042002;
export const EXPLORER = "https://testnet.arcscan.app";

export const CONTRACTS = {
  IDENTITY_REGISTRY: "0x8004A818BFB912233c491871b3d84c89A494BD9e",
  REPUTATION_REGISTRY: "0x8004B663056A597Dffe9eCcC1965A193B7388713",
  VALIDATION_REGISTRY: "0x8004Cb1BF31DAf7788923b405b754f57acEB4272",
  ANV_TOKEN: "0x736223037D622ed365fa641a116daAcED7A5be96",
};

export const IDENTITY_ABI = [
  "function register(string metadataURI)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
];

export const REPUTATION_ABI = [
  "function giveFeedback(uint256 agentId,int128 score,uint8 feedbackType,string tag,string metadataURI,string evidenceURI,string comment,bytes32 feedbackHash)",
];

export const VALIDATION_ABI = [
  "function validationRequest(address validator,uint256 agentId,string requestURI,bytes32 requestHash)",
];

export const ERC20_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function decimals() view returns (uint8)",
];
