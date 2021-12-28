const { assert, expect } = require('chai')

const NotaryLicense = artifacts.require('NotaryLicense.sol')

let notarylicense
let supply

contract("Notary License", async (accounts) => {
    describe("Notary License Deployed Successfully", async () => {
        it("Notary License Has Name and Symbol", async () => {
            // Deployed
            notarylicense = await NotaryLicense.new()
            // Fetch and compare name
            const name = await notarylicense.name()
            assert.equal(name, "Notary License")
            // Fetch and compare symbol
            const symbol = await notarylicense.symbol()
            assert.equal(symbol, "NLCNS")
        })
    })
    describe("Successful License Issue", async () => {
        it("Notary License Was Issued", async () => {
            // Make sure supply is 0
            supply = await notarylicense.totalSupply()
            assert.equal(supply, 0)
            // Issue License to accounts[2]
            await notarylicense.issueLicense(accounts[2], {from: accounts[0]})
            // Check supply increase
            supply = await notarylicense.totalSupply()
            assert.equal(supply, 1)
            // Verify is_licensed
            const is_licensed = await notarylicense.checkIfLicensed(accounts[2])
            assert.equal(is_licensed, true)
        })
    })
    describe("Successful License Revokation", async () => {
        it("Notary License Was Revoked", async () => {
            // Verify accounts[2] still licensed
            let is_licensed = await notarylicense.checkIfLicensed(accounts[2])
            assert.equal(is_licensed, true)
            // Revoke License
            await notarylicense.revokeLicense(accounts[2], {from: accounts[0]})
            // Verify supply decreased
            supply = await notarylicense.totalSupply()
            assert.equal(supply, 0)
            // Verify accounts[2] is not licensed
            is_licensed = await notarylicense.checkIfLicensed(accounts[2])
            assert.equal(is_licensed, false)
            // Verify accounts[2] is now banned
            const is_banned = await notarylicense.checkIfBanned(accounts[2])
            assert.equal(is_banned, true)
        })
        it("Banned User Can't Recieve a New License", async () => {
            // Verify accounts[2] still banned
            let is_banned = await notarylicense.checkIfBanned(accounts[2])
            assert.equal(is_banned, true)
            // Attempt to issue license and get error msg
            try {
                await notarylicense.issueLicense(accounts[2], {from: accounts[0]})
            } catch (err) {
                assert.equal(err.message, "Returned error: VM Exception while processing transaction: revert Reciever is banned from obtaining a license. -- Reason given: Reciever is banned from obtaining a license..")
            }
            
            // Ensure user still banned
            is_banned = await notarylicense.checkIfBanned(accounts[2])
            assert.equal(is_banned, true)
            // Ensure is_licensed is false
            const is_licensed = await notarylicense.checkIfLicensed(accounts[2])
            assert.equal(is_licensed, false)
            // Ensure supply is still 0
            supply = await notarylicense.totalSupply()
            assert.equal(supply, 0)
        })
    })
})