const dns = require('node:dns')
const mongoose = require('mongoose')

const dnsServers = process.env.DNS_SERVERS?.split(',').map(server => server.trim()).filter(Boolean)
dns.setServers(dnsServers?.length ? dnsServers : ['1.1.1.1', '8.8.8.8'])
async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to DB')
    } catch (error) {
        console.error('Database connection failed:', error)
        throw error
    }
}

module.exports = {connectToDB}