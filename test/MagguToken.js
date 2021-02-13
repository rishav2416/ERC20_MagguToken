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
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard, "MagguToken v1.0");
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
    it("Transfers ownership", function(){
        return MagguToken.deployed().then(function(i){
            tokenInstance=i;
            return tokenInstance.transfer.call(accounts[1], 99999999999);
        }).then(assert.fail).catch(function(e){
            assert(e.message.indexOf('revert')>=0, "error msg must have a revert");
            return tokenInstance.transfer.call(accounts[1], 250000, {from : accounts[0]});
        }).then(function(success){
            assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'trigger one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Trigger event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account token are transferred to');
            assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);

        }).then(function(balance){
            assert.equal(balance.toNumber(), 250000, 'money recieved by recieving account');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 750000, "money sent by sender");
        })
    })

})