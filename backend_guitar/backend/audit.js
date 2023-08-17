const { v4: uuid } = require('uuid')
const { format } = require('date-fns')
const fs = require('fs')
const path = require('path')

const audit = (msg) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`
    const logItem = `${uuid()}\t${dateTime}\t${msg} \n`
    if (!fs.existsSync(path.join(__dirname, 'audit'))) {
        fs.mkdir(path.join(__dirname, 'audit'), (err) => {
            if (err) console.log(err)
        })
    }
    fs.appendFile(path.join(__dirname, 'audit', 'logs.txt'), logItem, (err) => {
        if (err) console.log(err)
    })
}

module.exports = { audit }