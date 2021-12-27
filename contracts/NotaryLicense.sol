//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NotaryLicense is ERC20 {
    mapping (address => bool) is_licensed;
    mapping (address => bool) banned;

    event IssuedLicense(address indexed reciever, bool licensed);
    event RevokedLicense(address indexed to_revoke, bool revoked);

    constructor() ERC20("Notary License", "NLCNS") {
    }

    function issueLicense(address reciever) public { // Restrict ownership in future
        // Require that reciever of license is not already licensed
        require(!is_licensed[reciever], "Reciever already has a license.");
        // Ensure reciever has not had a license revoked
        require(!banned[reciever], "Reciever is banned from obtaining a license.");
        // Mint reciever a license
        _mint(reciever, 1);
        // Add reciever to is_licensed
        is_licensed[reciever] = true;
        // Make sure event is displayed on chain
        emit IssuedLicense(reciever, true);
    }

    function revokeLicense(address to_revoke) public { // ENSURE ownership restricted in future
        // Verify user has license to revoke
        require(is_licensed[to_revoke], "Reciever is not licensed.");
        // Burn their license
        _burn(to_revoke, 1);
        // Add user to ban list
        banned[to_revoke] = true;
        // Take away license
        is_licensed[to_revoke] = false;
        // Make sure event displayed on chain
        emit RevokedLicense(to_revoke, true);
    }

    function checkIfLicensed(address to_check) public view returns(bool) {
        return is_licensed[to_check];
    }

    function checkIfBanned(address is_banned) public view returns(bool) {
        return banned[is_banned];
    }
}