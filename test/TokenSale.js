var TokenSale = artifacts.require("./TokenSale.sol");
var MagguToken = artifacts.require("./MagguToken.sol");

contract("TokenSale", function (accounts) {
  var tokenSaleInstance;
  var tokenInstance;
  var admin = accounts[0];
  var tokenPrice = 1000000000000000;
  var buyer = accounts[1]; //in wei
  var tokensAvailable = 750000;
  var numberOfTokens;

  it("initializes the contract with the correct values", function () {
    return TokenSale.deployed()
      .then(function (i) {
        tokenSaleInstance = i;
        return tokenSaleInstance.address;
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, "has contract address");
        return tokenSaleInstance.tokenPrice();
      })
      .then(function (price) {
        assert.equal(price, tokenPrice, "token price is correct");
      });
  });
  it("facilitates Token Buy", function () {
    return MagguToken.deployed()
      .then(function (i) {
        //Grabbing token instance first
        tokenInstance = i;
        return TokenSale.deployed();
      })
      .then(function (i) {
        //Grabbing sale instance
        tokenSaleInstance = i;
        //Provision 75% tokens to token sale contract
        return tokenInstance.transfer(
          tokenSaleInstance.address,
          tokensAvailable,
          { from: admin }
        );
      })
      .then(function (receipt) {
        numberOfTokens = 10;
        return tokenSaleInstance.buyToken(numberOfTokens, {
          from: buyer,
          value: numberOfTokens * tokenPrice
        });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "trigger one event");
        assert.equal(
          receipt.logs[0].event,
          "Sell",
          "should be the Trigger event"
        );
        assert.equal(
          receipt.logs[0].args._buyer,
          buyer,
          "logs the account which buys tokens"
        );
        assert.equal(
          receipt.logs[0].args._amount,
          numberOfTokens,
          "logs the number of tokens purchased"
        );
        return tokenSaleInstance.tokensSold();
      })
      .then(function (amount) {
        assert.equal(
          amount.toNumber(),
          numberOfTokens,
          "increments the amount of tokens sold"
        );
        return tokenInstance.balanceOf(buyer);
      })
      .then(function (balance) {
        assert.equal(balance.toNumber(), numberOfTokens);
        return tokenInstance.balanceOf(tokenSaleInstance.address);
      })
      .then(function (balance) {
        assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
     // Try to buy tokens different from the ether value
     return tokenSaleInstance.buyToken(numberOfTokens, { from: buyer, value: 1 });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
      return tokenSaleInstance.buyToken(800000, { from: buyer, value: numberOfTokens * tokenPrice })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
    });
  });
});
