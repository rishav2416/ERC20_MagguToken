var MagguToken = artifacts.require("./MagguToken.sol");
var TokenSale = artifacts.require("./TokenSale.sol");

module.exports = function (deployer) {
    deployer.deploy(MagguToken, 1000000).then(function(){
        deployer.deploy(TokenSale, MagguToken.address, 1000000000000000);
    });
    
};
