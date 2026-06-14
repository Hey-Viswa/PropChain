// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title EncumbranceRegistry
 * @notice Phase 2 — on-chain lien/mortgage registry.
 *
 * Banks/lenders (BANK_ROLE) record an encumbrance (lien) against a PropertyNFT
 * token id. A transfer flow should refuse to move a property while an active
 * lien exists. This contract is the rich, queryable record of liens; the
 * PropertyNFT.hasEncumbrance flag remains the on-chain transfer gate and can be
 * kept in sync by the backend reconciliation worker.
 *
 * Roles:
 *  - DEFAULT_ADMIN_ROLE: can grant/revoke BANK_ROLE.
 *  - BANK_ROLE: can add and release liens.
 */
contract EncumbranceRegistry is AccessControl {
    bytes32 public constant BANK_ROLE = keccak256("BANK_ROLE");

    struct Lien {
        address lender;     // wallet of the bank/lender that registered the lien
        uint256 amount;     // outstanding amount (in wei-equivalent units, app-defined)
        string  reason;     // human-readable note (e.g. "Home loan #4567")
        uint256 createdAt;  // block timestamp the lien was added
        uint256 releasedAt; // block timestamp the lien was released (0 if active)
        bool    active;     // true while the lien encumbers the property
    }

    // tokenId => current lien record
    mapping(uint256 => Lien) public liens;
    // tokenId => count of liens ever recorded (for off-chain history correlation)
    mapping(uint256 => uint256) public lienCount;

    event LienAdded(
        uint256 indexed tokenId,
        address indexed lender,
        uint256 amount,
        string  reason,
        uint256 timestamp
    );
    event LienReleased(
        uint256 indexed tokenId,
        address indexed lender,
        uint256 timestamp
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(BANK_ROLE, admin);
    }

    /// @notice Record a new active lien on a property. Reverts if one is active.
    function addLien(
        uint256 tokenId,
        uint256 amount,
        string calldata reason
    ) external onlyRole(BANK_ROLE) {
        require(!liens[tokenId].active, "Active lien exists");
        require(amount > 0, "Amount must be > 0");

        liens[tokenId] = Lien({
            lender:     msg.sender,
            amount:     amount,
            reason:     reason,
            createdAt:  block.timestamp,
            releasedAt: 0,
            active:     true
        });
        lienCount[tokenId] += 1;

        emit LienAdded(tokenId, msg.sender, amount, reason, block.timestamp);
    }

    /// @notice Release the active lien on a property. Reverts if none active.
    function releaseLien(uint256 tokenId) external onlyRole(BANK_ROLE) {
        Lien storage lien = liens[tokenId];
        require(lien.active, "No active lien");

        lien.active = false;
        lien.releasedAt = block.timestamp;

        emit LienReleased(tokenId, lien.lender, block.timestamp);
    }

    /// @notice True if the property currently has an active lien.
    function hasActiveLien(uint256 tokenId) external view returns (bool) {
        return liens[tokenId].active;
    }

    /// @notice Full lien record for a property (active or last-released).
    function getLien(uint256 tokenId) external view returns (Lien memory) {
        return liens[tokenId];
    }

    // ── Role management helpers ──────────────────────────────────────────────
    function grantBankRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(BANK_ROLE, account);
    }

    function revokeBankRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(BANK_ROLE, account);
    }
}
