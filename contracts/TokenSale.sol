// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;
import "./MagguToken.sol";

contract TokenSale{
    address admin;
    MagguToken public tokenContract;
    uint256 public tokenPrice;
    
    constructor(MagguToken _tokenContract, uint256 _tokenPrice){
        //Assign admin
        admin=msg.sender;
        //Token Contract
        tokenContract=_tokenContract;
        //Token Price set
        tokenPrice =  _tokenPrice;
    }
}