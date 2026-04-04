// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract PropertyNFT is ERC721, AccessControl {

  bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

  struct PropertyData {
    string ulpin;
    string ipfsHash;
    string propertyAddress;
    uint256 areaSqFt;
    bool approved;
  }

  uint256 private _tokenIdCounter;

  mapping(uint256 => PropertyData) public properties;
  mapping(string => uint256) public ulpinToTokenId;

  event PropertyRegistered(uint256 indexed tokenId, string ulpin, address indexed owner);
  event PropertyApproved(uint256 indexed tokenId, address indexed oracle);
  event PropertyRejected(uint256 indexed tokenId, address indexed oracle);
  event OwnershipTransfer(uint256 indexed tokenId, address indexed from, address indexed to);

  constructor(address admin) ERC721("PropChain Property", "PROP") {
    _grantRole(DEFAULT_ADMIN_ROLE, admin);
  }

  /**
   * @notice Mint a new property NFT.
   * @dev Any KYC'd user can mint their own property.
   *      The token is minted to msg.sender.
   */
  function mintProperty(
    string memory ulpin,
    string memory ipfsHash,
    string memory propertyAddress,
    uint256 areaSqFt
  ) external returns (uint256) {
    require(bytes(ulpin).length > 0, "ULPIN required");
    require(areaSqFt > 0, "Invalid area");
    require(ulpinToTokenId[ulpin] == 0, "ULPIN already registered");

    uint256 tokenId = _tokenIdCounter;
    _tokenIdCounter++;

    _safeMint(msg.sender, tokenId);

    properties[tokenId] = PropertyData({
      ulpin: ulpin,
      ipfsHash: ipfsHash,
      propertyAddress: propertyAddress,
      areaSqFt: areaSqFt,
      approved: false
    });

    ulpinToTokenId[ulpin] = tokenId;

    emit PropertyRegistered(tokenId, ulpin, msg.sender);
    return tokenId;
  }

  /**
   * @notice Oracle approves a registered property.
   * @dev Only accounts with ORACLE_ROLE may call this.
   */
  function approveProperty(uint256 tokenId) external onlyRole(ORACLE_ROLE) {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    require(!properties[tokenId].approved, "Already approved");
    properties[tokenId].approved = true;
    emit PropertyApproved(tokenId, msg.sender);
  }

  /**
   * @notice Oracle rejects a registered property.
   * @dev Only accounts with ORACLE_ROLE may call this.
   */
  function rejectProperty(uint256 tokenId) external onlyRole(ORACLE_ROLE) {
    require(_ownerOf(tokenId) != address(0), "Token does not exist");
    emit PropertyRejected(tokenId, msg.sender);
    _burn(tokenId);
  }

  /**
   * @notice Transfer property ownership to another address.
   * @dev Only the current token owner may call this.
   */
  function transferProperty(uint256 tokenId, address to) external {
    require(ownerOf(tokenId) == msg.sender, "Not owner");
    require(to != address(0), "Invalid recipient");
    _transfer(msg.sender, to, tokenId);
    emit OwnershipTransfer(tokenId, msg.sender, to);
  }

  // hasRole and grantRole are inherited from AccessControl — DEFAULT_ADMIN_ROLE only

  function supportsInterface(bytes4 interfaceId)
    public view override(ERC721, AccessControl)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
