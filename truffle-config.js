module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // localhost
      port: 7545, // port
      network_id: "*", // Any network id
    },
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.7.4",    // Fetch exact version from solc-bin (default: truffle's version)
    }
  }
};