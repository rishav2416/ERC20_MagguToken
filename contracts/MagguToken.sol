// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;

contract MagguToken{
    //Name
    string public name="MagguToken";
    //Symbol
    string public symbol ="MUG";
    //Total Supply
    uint256 public totalSupply;
    
    mapping(address=> uint256) public balanceOf;

    //Constructor
    constructor(uint256 _initialSupply){
        //allocate the initial supply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }




}