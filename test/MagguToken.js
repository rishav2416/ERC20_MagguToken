var MagguToken = artifacts.require("./MagguToken.sol"); 

contract("MagguToken", function(accounts){
    var tokenInstance;
    // Check whether total supply is matching 1 million
    it("initializes the contract with correct values", function()
    {
        return MagguToken.deployed().then(function(i){
            tokenInstance = i;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, "MagguToken", "Name is correct");
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, "MUG", "Symbol matches");
        });
    })
    it("sets the total supply upon deployment", function()
    {
        return MagguToken.deployed().then(function(i){
            tokenInstance =i;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), 1000000, 'set the total supply to 1000000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(), 1000000, "give the whole supply to admin");
        });
    });

})