const dns = require('node:dns')
const mongoose = require('mongoose')

const dnsServers = process.env.DNS_SERVERS?.split(',').map(server => server.trim()).filter(Boolean)
dns.setServers(dnsServers?.length ? dnsServers : ['1.1.1.1', '8.8.8.8'])
async function connectToDB() {
    try {
        mongoose.connect(process.env.MONGO_URI)
            console.log('conneted to DB')
    } catch (error) {
        console.log(error)
    }
}

module.exports = {connectToDB}