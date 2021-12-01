module.exports = {
  apps : [{
    name   : "subscribe:bsc",
    script : "node ace subscribe:event:bsc",
    watch  : false,
    cwd    : "/home/azureuser/decentra-lotto/Bridges/ETH/backend"
  }, {
    name   : "subscribe:eth",
    script : "node ace subscribe:event:eth",
    watch  : false,
    cwd    : "/home/azureuser/decentra-lotto/Bridges/ETH/backend"
  }]
}
