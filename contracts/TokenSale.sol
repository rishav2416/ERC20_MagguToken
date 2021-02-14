// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;
import "./MagguToken.sol";

contract TokenSale {
    address payable admin;
    MagguToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokenSold; 

    event Sell(
        address _buyer,
        uint256 _amount
    );

    constructor(MagguToken _tokenContract, uint256 _tokenPrice) {
        //Assign admin
        admin = msg.sender;
        //Token Contract
        tokenContract = _tokenContract;
        //Token Price set
        tokenPrice = _tokenPrice;
    }

    //Multiply
    function multiply(uint256 x, uint y) internal pure returns(uint z){
        require(y==0 || (z-x*y)/y==x);
    }
//pure means they re not doing any transcation


    //Buy Token
    function buyToken(uint256 _numberOfTokens) public payable {
    //Require that value is equal to tokens
    require(multiply(_numberOfTokens, tokenPrice)==msg.value);
    //Require that contract has enough tokens
    require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
    // Require that transfer is successful
    require(tokenContract.transfer( msg.sender, _numberOfTokens ));
    //Trigger event 
    emit Sell(msg.sender, _numberOfTokens); 

    // Keep track of tokenSold
    tokenSold += _numberOfTokens;
    }
    //Ending Token Sale
    function endSale() public { 
        //Only admin can do this
        require(msg.sender==admin);
        //Transfer amount of remaining token to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

        admin.transfer(address(this).balance);

    }
}
