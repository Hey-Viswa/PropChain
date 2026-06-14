// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title FractionalOwnership
 * @notice Phase 3 — REIT-style fractional ownership of a single PropertyNFT.
 *
 * Flow:
 *  1. The NFT owner approves this vault for their token.
 *  2. They call fractionalize(tokenId, totalShares). The vault pulls the NFT in
 *     and mints `totalShares` ERC-20 share tokens to them.
 *  3. Shares trade like any ERC-20 (each represents a fraction of the property).
 *  4. A holder who reassembles 100% of the shares can call redeem() to burn all
 *     shares and reclaim the underlying NFT.
 *
 * One vault instance backs exactly one property (deploy one per property).
 */
contract FractionalOwnership is ERC20, ERC721Holder, ReentrancyGuard {
    IERC721 public immutable propertyNFT;

    bool    public fractionalized;
    uint256 public underlyingTokenId;
    address public originalDepositor;

    event Fractionalized(
        uint256 indexed tokenId,
        address indexed depositor,
        uint256 totalShares
    );
    event Redeemed(
        uint256 indexed tokenId,
        address indexed redeemer
    );

    constructor(
        address nftAddress,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        require(nftAddress != address(0), "Invalid NFT address");
        propertyNFT = IERC721(nftAddress);
    }

    /// @notice Lock an owned PropertyNFT and mint fractional shares to the caller.
    function fractionalize(uint256 tokenId, uint256 totalShares)
        external
        nonReentrant
    {
        require(!fractionalized, "Already fractionalized");
        require(totalShares > 0, "Shares must be > 0");
        require(propertyNFT.ownerOf(tokenId) == msg.sender, "Not token owner");

        fractionalized = true;
        underlyingTokenId = tokenId;
        originalDepositor = msg.sender;

        // Pull the NFT into the vault (caller must have approved this contract).
        propertyNFT.safeTransferFrom(msg.sender, address(this), tokenId);

        _mint(msg.sender, totalShares);

        emit Fractionalized(tokenId, msg.sender, totalShares);
    }

    /// @notice Burn 100% of shares to reclaim the underlying NFT.
    function redeem() external nonReentrant {
        require(fractionalized, "Not fractionalized");
        uint256 supply = totalSupply();
        require(supply > 0, "No shares outstanding");
        require(balanceOf(msg.sender) == supply, "Need all shares");

        uint256 tokenId = underlyingTokenId;

        // Effects before interaction (CEI pattern).
        _burn(msg.sender, supply);
        fractionalized = false;

        propertyNFT.safeTransferFrom(address(this), msg.sender, tokenId);

        emit Redeemed(tokenId, msg.sender);
    }
}
