// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;

contract MagguToken{
    //Name
    string public name="MagguToken";
    //Symbol
    string public symbol ="MUG";
    //Standard
    string public standard= "MagguToken v1.0";

    //Total Supply
    uint256 public totalSupply;
    
    mapping(address=> uint256) public balanceOf;

    //Transfer Event
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value   
    );

    //Constructor
    constructor(uint256 _initialSupply){
        //allocate the initial supply
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    //Transfer function
    function transfer(address _to, uint256 _value) public returns (bool success){
            //Exception if account doesn't have enough
            require(balanceOf[msg.sender]>=_value); //if it is true, continue function execution
            
            //Transfer balance
            balanceOf[msg.sender] -=_value;
            balanceOf[_to] +=_value;

            //Transfer event
            emit Transfer(msg.sender, _to, _value);

            return true;


    }

}