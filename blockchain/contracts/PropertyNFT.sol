// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PropertyNFT is ERC721, AccessControl, Pausable, ReentrancyGuard {

  bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
  bytes32 public constant KYC_ROLE    = keccak256("KYC_ROLE");

  struct Property {
    string  ulpin;
    string  ipfsDocHash;
    string  physicalAddress;
    uint256 areaSqFt;
    uint256 registeredAt;
    bool    isApproved;
    bool    hasEncumbrance;
    address registeredBy;
  }

  uint256 private _nextTokenId;

  mapping(uint256 => Property)  public properties;
  mapping(string  => uint256)   public ulpinToToken;
  mapping(string  => bool)      public ulpinExists;
  mapping(address => bool)      public kycVerified;
  mapping(address => uint256[]) private _ownerTokens;

  event PropertyRegistered(
    uint256 indexed tokenId,
    string  ulpin,
    address indexed owner,
    uint256 timestamp
  );
  event PropertyApproved(uint256 indexed tokenId, address indexed oracle);
  event PropertyRejected(uint256 indexed tokenId, address indexed oracle, string reason);
  event KYCVerified(address indexed wallet);
  event OwnershipTransferInitiated(uint256 indexed tokenId, address from, address to);

  constructor(address admin) ERC721("PropChain Property", "PROP") {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
    _grantRole(ORACLE_ROLE, admin);
    _grantRole(KYC_ROLE, admin);
  }

  // KYC verification — called by backend with KYC_ROLE
  function verifyKYC(address wallet) external onlyRole(KYC_ROLE) {
    kycVerified[wallet] = true;
    emit KYCVerified(wallet);
  }

  // Mint property NFT — only KYC verified wallets
  function mintProperty(
    string memory ulpin,
    string memory docHash,
    string memory physAddress,
    uint256 areaSqFt
  ) external whenNotPaused nonReentrant returns (uint256) {
    require(kycVerified[msg.sender], "KYC not verified");
    require(!ulpinExists[ulpin], "ULPIN already registered");
    require(bytes(ulpin).length > 0, "ULPIN required");
    require(areaSqFt > 0, "Invalid area");

    uint256 tokenId = _nextTokenId++;
    _safeMint(msg.sender, tokenId);

    properties[tokenId] = Property({
      ulpin:           ulpin,
      ipfsDocHash:     docHash,
      physicalAddress: physAddress,
      areaSqFt:        areaSqFt,
      registeredAt:    block.timestamp,
      isApproved:      false,
      hasEncumbrance:  false,
      registeredBy:    msg.sender
    });

    ulpinToToken[ulpin] = tokenId;
    ulpinExists[ulpin]  = true;
    _ownerTokens[msg.sender].push(tokenId);

    emit PropertyRegistered(tokenId, ulpin, msg.sender, block.timestamp);
    return tokenId;
  }

  // Oracle approves property — makes it officially registered
  function approveProperty(uint256 tokenId)
    external onlyRole(ORACLE_ROLE) {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    require(!properties[tokenId].isApproved, "Already approved");
    properties[tokenId].isApproved = true;
    emit PropertyApproved(tokenId, msg.sender);
  }

  // Oracle rejects property
  function rejectProperty(uint256 tokenId, string memory reason)
    external onlyRole(ORACLE_ROLE) {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    _burn(tokenId);
    emit PropertyRejected(tokenId, msg.sender, reason);
  }

  // Transfer with approval check
  function transferProperty(uint256 tokenId, address to)
    external nonReentrant whenNotPaused {
    require(ownerOf(tokenId) == msg.sender, "Not owner");
    require(properties[tokenId].isApproved, "Not approved");
    require(!properties[tokenId].hasEncumbrance, "Has encumbrance");
    require(kycVerified[to], "Buyer not KYC verified");
    require(to != address(0), "Invalid recipient");

    _transfer(msg.sender, to, tokenId);
    _removeFromOwnerTokens(msg.sender, tokenId);
    _ownerTokens[to].push(tokenId);

    emit OwnershipTransferInitiated(tokenId, msg.sender, to);
  }

  // View functions
  function getProperty(uint256 tokenId)
    external view returns (Property memory) {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    return properties[tokenId];
  }

  function getOwnerTokens(address owner)
    external view returns (uint256[] memory) {
    return _ownerTokens[owner];
  }

  function getTokenByULPIN(string memory ulpin)
    external view returns (uint256) {
    require(ulpinExists[ulpin], "ULPIN not found");
    return ulpinToToken[ulpin];
  }

  // Admin functions
  function pause()   external onlyRole(DEFAULT_ADMIN_ROLE) { _pause(); }
  function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) { _unpause(); }

  function setEncumbrance(uint256 tokenId, bool status)
    external onlyRole(ORACLE_ROLE) {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    properties[tokenId].hasEncumbrance = status;
  }

  // Internal helpers
  function _removeFromOwnerTokens(address owner, uint256 tokenId) internal {
    uint256[] storage tokens = _ownerTokens[owner];
    for (uint256 i = 0; i < tokens.length; i++) {
      if (tokens[i] == tokenId) {
        tokens[i] = tokens[tokens.length - 1];
        tokens.pop();
        break;
      }
    }
  }

  function supportsInterface(bytes4 interfaceId)
    public view override(ERC721, AccessControl)
    returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}