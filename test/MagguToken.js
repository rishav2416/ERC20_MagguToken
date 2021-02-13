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
    });
    it("approves tokens for delegated transfers", function(){
        return MagguToken.deployed().then(function(i){
            tokenInstance=i;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success){
            assert.equal(success, true, "it returns true");
            return tokenInstance.approve(accounts[1], 100);
        }).then(function(receipt){
             assert.equal(receipt.logs.length, 1, 'trigger one event');
             assert.equal(receipt.logs[0].event, 'Approval', 'should be the Trigger event');
             assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account tokens are transferred from');
             assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account token are transferred to');
             assert.equal(receipt.logs[0].args._value, 100, 'logs the transfer amount');
             return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
        })
    });
    it("handles delegate transfers", function(){
        return MagguToken.deployed().then(function(i){
            tokenInstance = i;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount= accounts[4]; 
            //Transfer some token to fromAccount
            return tokenInstance.transfer(fromAccount, 100, {from: accounts[0]});    
        }).then(function(receipt){
            //Approve spending account to spend 10 token from fromAccount
            return tokenInstance.approve(spendingAccount, 10, {from : fromAccount});  
        }).then(function(receipt){
            //Try spending something larger than sender's balance
            return tokenInstance.transferFrom(fromAccount, toAccount, 110, {from : spendingAccount});
        }).then(assert.fail).catch(function(e){
            assert(e.message.indexOf('revert')>=0, 'cannot send more than balance');
            //Try trasferring something larger than the approved amount
            return tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendingAccount});
        }).then(assert.fail).catch(function(e){
            assert(e.message.indexOf('revert')>=0, 'cannot transfer value larger than approved amount');
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10,{from:spendingAccount});
        }).then(function(success){
            assert.equal(success, true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from : spendingAccount});
        }).then(function(receipt){
            assert.equal(receipt.logs.length, 1, 'trigger one event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the Trigger event');
            assert.equal(receipt.logs[0].args._from, accounts[2], 'logs the account tokens are transferred from');
            assert.equal(receipt.logs[0].args._to, accounts[3], 'logs the account token are transferred to');
            assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 90, 'deducts the amount from sender account');
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance){
            assert.equal(balance.toNumber(), 10, 'adding the amount ot reciever account');
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance){
            assert.equal(allowance.toNumber(), 0, 'deducted the allowance');
        })
    })

})