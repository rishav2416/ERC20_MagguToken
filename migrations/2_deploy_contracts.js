var MagguToken = artifacts.require("./MagguToken.sol");

module.exports = function (deployer) {
    deployer.deploy(MagguToken);
};
