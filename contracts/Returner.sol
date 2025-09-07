// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
contract Ownable{
    address owner;

    constructor (){
        owner = msg.sender;
    }
    
    // Require sender to be owner 
    modifier onlyOwner(){
        require (msg.sender == owner, "Not Owner");
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner{
        require(newOwner != owner, "Address is already owner");
        owner = newOwner;
    }

    

}