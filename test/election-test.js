const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Election Contract", function () {
    let Election;
    let election;
    let owner;

    const NUM_TOTAL_NOT_MY_VOTES = 5;
    const NUM_TOTAL_MY_VOTES = 3;

    let totalVotes;
    let totalMyVotes;

    beforeEach(async function () {
        Election = await ethers.getContractFactory("Election");
        [owner, addr1, addr2] = await ethers.getSigners();
        election = await Election.deploy();

        totalVotes = [];
        totalMyVotes = [];

        for (let i = 0; i < NUM_TOTAL_NOT_MY_VOTES; i++) {
            let vote = {
                'citizen_ssn': `${i}`,
                'username': addr1,
                'citizen_nationality': 'french',
                'election_year': 2021,
                'election_round': 1,
                'election_type': 1,
                'candidate_id': 1,
                'timestamp': 1478431966
            };

            await election.connect(addr1).addVote(vote.citizen_ssn, vote.citizen_nationality, vote.election_year, vote.election_round,
                vote.election_type, vote.candidate_id);
            totalVotes.push(vote);
        }

        for (let i = 0; i < NUM_TOTAL_MY_VOTES; i++) {
            let vote = {
                'username': owner,
                'citizen_ssn': `${i}`,
                'citizen_nationality': 'french',
                'election_year': 2021,
                'election_round': 1,
                'election_type': 1,
                'candidate_id': 1
            };

            await election.addVote(vote.citizen_ssn, vote.citizen_nationality, vote.election_year, vote.election_round,
                vote.election_type, vote.candidate_id);
            totalVotes.push(vote);
            totalMyVotes.push(vote);
        }
    });

    describe("Add Vote", function () {
        it("should emit AddVote event", async function () {

            let vote = {
                'citizen_ssn': 1,
                'citizen_nationality': 'french',
                'election_year': 2021,
                'election_round': 1,
                'election_type': 1,
                'candidate_id': 1
            };

            await expect(await election.addVote(vote.citizen_ssn, vote.citizen_nationality, vote.election_year, vote.election_round,
                vote.election_type, vote.candidate_id)
            ).to.emit(election, 'AddVote').withArgs(owner.address, NUM_TOTAL_NOT_MY_VOTES + NUM_TOTAL_MY_VOTES);
        })
    });

    describe("Get All Votes", function () {
        it("should return the correct number of total votes", async function () {
            const votesFromChain = await election.getAll();
            console.log(votesFromChain[0]);
            expect(votesFromChain.length).to.equal(NUM_TOTAL_NOT_MY_VOTES + NUM_TOTAL_MY_VOTES);
        })
    })
});