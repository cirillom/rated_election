// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract IdentityManager {

    // basic Identity struct
    struct Identity {
        // Obs.: this id attribute don't actually need to be here!
        // but it helps with clean code.
        string id; // string so it can handle UUID
        string name; // names aren't unique!
        bool active;
    }

    // event to register Identities created
    event IdentityCreated(string id, string name);

    // mapping to store Identities by id, and check if they exist
    mapping(string => Identity) private identities;

    modifier identityExists(string memory _id) {
        require(identities[_id].active, "Identity does not exist.");
        _;
    }

    modifier identityDontExists(string memory _id) {
        require (!(identities[_id].active), "Identity already exists.");
        _;
    }

    function createIdentity(string memory _id, string memory _name) public 
    identityDontExists(_id) {
        // storing new identity
        identities[_id] = Identity(_id, _name, true);
        // calling event
        emit IdentityCreated(_id, _name);
    }
    
    function getNameFromId(string memory _id) public view identityExists(_id) 
    returns (string memory) {
        return (identities[_id].name);
    }
}