const net = require('net')
const prompt = require('prompt-sync')()

const zebraPrinterIP = prompt('Enter Zebra Printer IP Address: ')
const zebraPort = 9100
const reversed = prompt('Print Reversed? (Y/N) ')
const isReversed = reversed.toUpperCase() === 'Y'
let startingNum = parseInt(prompt('Starting Number? '),10)
let numToPrint = parseInt(prompt('Number to Print? '),10)


const client = new net.Socket()
client.connect(zebraPort, zebraPrinterIP, () => {
    console.log('Connected to Zebra printer')
    
    if (isReversed) {
        let bibNum = startingNum + numToPrint - 1
        for (let i = 1; i <= numToPrint; i++) {
            client.write(generateRawZPL(bibNum))
            bibNum--
        }
    } else {
        let bibNum = startingNum
        for (let i = 1; i <= numToPrint; i++) {
            client.write(generateRawZPL(bibNum))
            bibNum++
        }
    }

    client.end()
})

client.on('close', () => {
    console.log('Connection closed')
})

function generateRawZPL(num) {
    intNum = parseInt(num, 10)
    let stringedNum = intNum.toString()
    //hexId needs to be 24 characters
    while (stringedNum.length < 24) {
        stringedNum = '0' + stringedNum
    }
    return `^XA
^FO150,50
^A0N,65
^FD${intNum}
^FS
^RFW,H
^FD${stringedNum}
^FS
^XZ
`
}
