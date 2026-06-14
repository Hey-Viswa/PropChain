// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title PropChainOracle
 * @notice Phase 2 — standalone on-chain registry for governance roles.
 *
 * Earlier phases tracked oracle/bank authority in Clerk + MongoDB only. This
 * contract makes those roles first-class, publicly verifiable on-chain state:
 * any party can confirm who may approve property registrations (ORACLE_ROLE)
 * or register liens (BANK_ROLE) without trusting the application database.
 *
 * Roles:
 *  - DEFAULT_ADMIN_ROLE: government super-admin; grants/revokes every role.
 *  - ORACLE_ROLE: authority that approves/rejects property registrations.
 *  - BANK_ROLE: lending institutions that register/release encumbrances.
 */
contract PropChainOracle is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant BANK_ROLE = keccak256("BANK_ROLE");

    event OracleGranted(address indexed account, address indexed by);
    event OracleRevoked(address indexed account, address indexed by);
    event BankGranted(address indexed account, address indexed by);
    event BankRevoked(address indexed account, address indexed by);

    constructor(address admin) {
        require(admin != address(0), "Invalid admin");
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ORACLE_ROLE, admin);
    }

    function grantOracle(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(account != address(0), "Invalid account");
        _grantRole(ORACLE_ROLE, account);
        emit OracleGranted(account, msg.sender);
    }

    function revokeOracle(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(ORACLE_ROLE, account);
        emit OracleRevoked(account, msg.sender);
    }

    function grantBank(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(account != address(0), "Invalid account");
        _grantRole(BANK_ROLE, account);
        emit BankGranted(account, msg.sender);
    }

    function revokeBank(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(BANK_ROLE, account);
        emit BankRevoked(account, msg.sender);
    }

    function isOracle(address account) external view returns (bool) {
        return hasRole(ORACLE_ROLE, account);
    }

    function isBank(address account) external view returns (bool) {
        return hasRole(BANK_ROLE, account);
    }
}
