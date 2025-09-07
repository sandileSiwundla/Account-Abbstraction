// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;
contract Maths{
    // public 
    function Addition(uint256 a, uint256 b) public pure returns (uint256){
       uint256 c = a + b;
        return c;
    }

    // internal
    function Multiplication(uint256 a, uint256 b) internal pure returns (uint256){
        uint256 c = a * b;
        return c;
    }

}