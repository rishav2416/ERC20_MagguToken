var MagguToken = artifacts.require("./MagguToken.sol"); 

contract("MagguToken", function(accounts){
    // Check whether total supply is matching 1 million
    it("sets the total supply upon deployment", function()
    {
        return MagguToken.deployed().then(function(i){
            tokenInstance =i;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply, 1000000, 'set the total supply to 1000000');
        });
    });

})