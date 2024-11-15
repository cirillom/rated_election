// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract RatedElection {
    address public owner;
    bool public electionClosed;
    struct Candidate {
        uint id;
        string name;
        uint totalRating;
    }
    uint public candidateCount;
    mapping(uint => Candidate) public candidates;
    mapping(address => bool) public authorizedVoters;
    mapping(address => mapping(uint => uint)) public voterRatings;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    modifier onlyAuthorizedVoter() {
        require(authorizedVoters[msg.sender], "Not authorized");
        _;
    }
    modifier electionNotClosed() {
        require(!electionClosed, "Election has ended");
        _;
    }

    constructor() {
        owner = msg.sender;
        electionClosed = false;
    }

    function addCandidate(string memory _name) public onlyOwner electionNotClosed {
        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }

    function addVoter(address _voter) public onlyOwner electionNotClosed{
        authorizedVoters[_voter] = true;
    }

    function rateCandidate(uint _candidateId, uint _rating) public onlyAuthorizedVoter electionNotClosed{
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        require(_rating <= 10, "Rating must be between 0 and 10");
        uint previousRating = voterRatings[msg.sender][_candidateId];
        candidates[_candidateId].totalRating = candidates[_candidateId].totalRating - previousRating + _rating;
        voterRatings[msg.sender][_candidateId] = _rating;
    }

    function getWinner() public view returns (uint winnerId, string memory winnerName, uint winnerRating) {
        uint highestRating = 0;
        uint _winnerId = 0;
        for(uint i = 1; i <= candidateCount; i++) {
            if(candidates[i].totalRating > highestRating) {
                highestRating = candidates[i].totalRating;
                _winnerId = i;
            }
        }
        require(_winnerId != 0, "No candidates");
        Candidate memory winner = candidates[_winnerId];
        electionClosed = true;
        return (winner.id, winner.name, winner.totalRating);
    }

    function getCandidateResult(uint _candidateId) public view returns (uint id, string memory name, uint totalRating) {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.totalRating);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidateCount);
        for(uint i = 1; i <= candidateCount; i++) { allCandidates[i-1] = candidates[i]; }
        return allCandidates;
    }
}