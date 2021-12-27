//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Struct to clean up proposal mapping
struct ProposalInfo {
    uint _id;
    address _signer;
    string _title;
    string _text;
}

contract Proposals is ERC721 {
    // ID is based on supply
    uint private supply;

    // ID => Info on Proposal
    mapping (uint => ProposalInfo) proposals;

    constructor() ERC721("Proposals", "DRAFT") {
        // Ensure Supply is 0 on deployment, for safety
        supply = 0;
    }
    
    function mint(string memory proposal_title, string memory proposal_text) public returns(uint) {
        // Increase supply and create new proposal id
        supply++;
        uint id = supply;
        // Mint new proposal and set id as new supply
        _mint(msg.sender, id);
        // Create the proposal data
        proposals[id] = ProposalInfo(id, msg.sender, proposal_title, proposal_text);
        // Return ID of new proposal so user can look at it in the future
        return id;
    }

    function getSupply() public view returns(uint) {
        return supply;
    }

    function getProposalTitle(uint _id) public view returns(string memory) {
        return proposals[_id]._title;
    }

    function getProposalText(uint _id) public view returns(string memory) {
        return proposals[_id]._text;
    }
}