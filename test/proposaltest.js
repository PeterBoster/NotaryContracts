const { assert } = require('chai')

const Proposals = artifacts.require('Proposals.sol')

let proposals

contract("Proposals", async () => {
    describe("Proposals Deployed", async () => {
        it("Proposal Contract Has Name and Symbol", async () => {
            proposals = await Proposals.new()

            const contract_name = await proposals.name()
            assert.equal(contract_name, "Proposals")

            const contract_symbol = await proposals.symbol()
            assert.equal(contract_symbol, "DRAFT")
        })
    })
    describe("Successful Mint", async () => {
        it("Mint Successfully Fetches Proposal Details and Owner", async () => {
            const mint = await proposals.mint("Title transfer", "Transfers title from me to you")

            const supply = await proposals.getSupply()
            assert.equal(supply, 1)

            const owner = await proposals.ownerOf(1)
            assert.equal(owner, "0x627306090abaB3A6e1400e9345bC60c78a8BEf57")

            const title = await proposals.getProposalTitle(1)
            assert.equal(title, "Title transfer")

            const text = await proposals.getProposalText(1)
            assert.equal(text, "Transfers title from me to you")
        })
    })
})

