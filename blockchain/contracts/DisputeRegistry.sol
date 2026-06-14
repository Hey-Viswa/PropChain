// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title DisputeRegistry
 * @notice Phase 2 — on-chain dispute flagging and resolution.
 *
 * Any wallet can raise a dispute against a PropertyNFT token id (e.g. a
 * competing ownership claim). A RESOLVER_ROLE holder (oracle/arbiter) resolves
 * it with a written outcome. A transfer flow should refuse to move a property
 * while it has an unresolved dispute.
 *
 * Roles:
 *  - DEFAULT_ADMIN_ROLE: can grant/revoke RESOLVER_ROLE.
 *  - RESOLVER_ROLE: can resolve disputes.
 */
contract DisputeRegistry is AccessControl {
    bytes32 public constant RESOLVER_ROLE = keccak256("RESOLVER_ROLE");

    struct Dispute {
        address raisedBy;
        string  reason;
        uint256 raisedAt;
        bool    resolved;
        string  resolution;
        address resolvedBy;
        uint256 resolvedAt;
        bool    exists;
    }

    // tokenId => current dispute slot
    mapping(uint256 => Dispute) public disputes;
    // tokenId => total disputes ever raised (off-chain history correlation)
    mapping(uint256 => uint256) public disputeCount;

    event DisputeRaised(
        uint256 indexed tokenId,
        address indexed raisedBy,
        string  reason,
        uint256 timestamp
    );
    event DisputeResolved(
        uint256 indexed tokenId,
        address indexed resolvedBy,
        string  resolution,
        uint256 timestamp
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(RESOLVER_ROLE, admin);
    }

    /// @notice Raise a dispute. Reverts if an unresolved dispute already exists.
    function raiseDispute(uint256 tokenId, string calldata reason) external {
        Dispute storage d = disputes[tokenId];
        require(!d.exists || d.resolved, "Active dispute exists");
        require(bytes(reason).length > 0, "Reason required");

        disputes[tokenId] = Dispute({
            raisedBy:   msg.sender,
            reason:     reason,
            raisedAt:   block.timestamp,
            resolved:   false,
            resolution: "",
            resolvedBy: address(0),
            resolvedAt: 0,
            exists:     true
        });
        disputeCount[tokenId] += 1;

        emit DisputeRaised(tokenId, msg.sender, reason, block.timestamp);
    }

    /// @notice Resolve the active dispute with a written outcome.
    function resolveDispute(uint256 tokenId, string calldata resolution)
        external
        onlyRole(RESOLVER_ROLE)
    {
        Dispute storage d = disputes[tokenId];
        require(d.exists && !d.resolved, "No active dispute");

        d.resolved = true;
        d.resolution = resolution;
        d.resolvedBy = msg.sender;
        d.resolvedAt = block.timestamp;

        emit DisputeResolved(tokenId, msg.sender, resolution, block.timestamp);
    }

    /// @notice True if the property has an unresolved dispute.
    function isDisputed(uint256 tokenId) external view returns (bool) {
        Dispute storage d = disputes[tokenId];
        return d.exists && !d.resolved;
    }

    /// @notice Full dispute record for a property.
    function getDispute(uint256 tokenId) external view returns (Dispute memory) {
        return disputes[tokenId];
    }

    // ── Role management helpers ──────────────────────────────────────────────
    function grantResolverRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(RESOLVER_ROLE, account);
    }

    function revokeResolverRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(RESOLVER_ROLE, account);
    }
}
