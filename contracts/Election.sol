pragma solidity 0.8.4;

/**
 * @title Election Contract
 * @dev Store & retrieve value in a variable
 */
contract Election {

    // event for adding votes, 
    event AddVote(address recipient, uint256 voteId);
    
    // Vote struct had the id of the vote, citizen that initiated the vote, 
    // election data, timestamp of the vote and the candidate selected

    struct Vote {
        uint256 id;
        address username;
        string citizen_ssn;
        string citizen_nationality;
        uint256 election_year;
        uint256 election_round;
        uint256 election_type;
        uint256 candidate_id;
        uint256 timestamp;
    }

    // list of votes
    Vote[] private votes;

    // Mapping of Vote id to the wallet address of the user
    mapping(uint256 => address) mappedVotes;

    // Function to add new vote to list of votes
    function addVote(string memory citizen_ssn, 
                string memory citizen_nationality, uint256 election_year, uint256 election_round, 
                uint256 election_type, uint256 candidate_id) external {

        uint256 voteId = votes.length;
        uint256 timestamp = block.timestamp;

        //add vote to the list of votes
        votes.push(Vote(voteId, msg.sender, citizen_ssn, citizen_nationality, election_year, election_round, 
        election_type, candidate_id, timestamp));

        mappedVotes[voteId] = msg.sender;
        emit AddVote(msg.sender, voteId);
    }

    // Function to retrieve all votes
    function getAll() external view returns (Vote[] memory) {
        Vote[] memory temporary = new Vote[](votes.length);
        uint256 counter = 0;

        // add all votes to temporary array of size length filtering deleted votes
        for (uint256 i = 0; i < votes.length; i++) {
            temporary[counter] = votes[i];
            counter++;
        }

        // then adding them to an array of size of number of undeleted votes
        Vote[] memory result = new Vote[](counter);
        for (uint256 i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        return result;
    }
}
