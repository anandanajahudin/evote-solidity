// SPDX-License-Identifier: Public Domain
pragma solidity ^0.8.19;
contract ZKLiteVotingDAO {
    address public admin;
    uint public proposalCount;
    struct Proposal {
        uint id;
        string description;
        uint voteYes;
        uint voteNo;
        bool open;
    }
    /// @notice Per-proposal voting parameters
    struct Settings {
        uint32 start; // unix timestamp when voting opens
        uint32 end; // unix timestamp when voting closes
        uint16 quorumPct; // % of total members that must vote for quorum
        uint16 passPct; // % of votes cast that must be “yes” to pass
    }
    mapping(uint => Proposal) public proposals;
    mapping(uint => Settings) public settings;
    mapping(bytes32 => bool) public nullifierHashUsed;
    mapping(address => bool) public members;
    uint public memberCount;
    event ProposalCreated(
        uint indexed proposalId,
        string description,
        Settings settings
    );
    event VoteSubmitted(
        uint indexed proposalId,
        bytes32 nullifierHash,
        bool voteYes
    );
    event MemberAdded(address member);
    modifier onlyAdmin() {
        require(msg.sender == admin, "Not authorized");
        _;
    }
    modifier onlyMember() {
        require(members[msg.sender], "Not a DAO member");
        _;
    }
    constructor() {
        admin = msg.sender;
    }
    function addMember(address _member) external onlyAdmin {
        require(!members[_member], "Already a member");
        members[_member] = true;
        memberCount++;
        emit MemberAdded(_member);
    }
    /// @notice Create a proposal with fully custom settings
    function createProposal(
        string calldata _description,
        uint32 _start,
        uint32 _end,
        uint16 _quorumPct,
        uint16 _passPct
    ) external onlyMember {
        require(_start < _end, "Bad time window");
        require(_quorumPct <= 100 && _passPct <= 100, "Pct > 100");
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id: proposalCount,
            description: _description,
            voteYes: 0,
            voteNo: 0,
            open: true
        });
        settings[proposalCount] = Settings({
            start: _start,
            end: _end,
            quorumPct: _quorumPct,
            passPct: _passPct
        });
        emit ProposalCreated(
            proposalCount,
            _description,
            settings[proposalCount]
        );
    }
    /// @notice Close early (admin override)
    function closeProposal(uint _proposalId) external onlyAdmin {
        proposals[_proposalId].open = false;
    }
    function submitVote(
        uint _proposalId,
        bytes32 _nullifierHash,
        bool _voteYes
    ) external onlyMember {
        Proposal storage prop = proposals[_proposalId];
        Settings memory s = settings[_proposalId];
        require(prop.open, "Voting closed");
        require(block.timestamp >= s.start, "Too early");
        require(block.timestamp <= s.end, "Too late");
        require(!nullifierHashUsed[_nullifierHash], "Double vote");
        nullifierHashUsed[_nullifierHash] = true;
        if (_voteYes) {
            prop.voteYes++;
        } else {
            prop.voteNo++;
        }
        emit VoteSubmitted(_proposalId, _nullifierHash, _voteYes);
    }
    /// @notice Returns "Accepted"|"Rejected"|"Tie"|"Quorum not met"
    function getProposalResult(
        uint _proposalId
    ) external view returns (string memory) {
        Proposal memory prop = proposals[_proposalId];
        Settings memory s = settings[_proposalId];
        // Check quorum
        uint totalVotes = prop.voteYes + prop.voteNo;
        uint needed = (memberCount * s.quorumPct + 99) / 100; // ceil
        if (totalVotes < needed) {
            return "Quorum not met";
        }
        // Check pass threshold
        if (prop.voteYes * 100 >= totalVotes * s.passPct) {
            return "Accepted";
        } else if (prop.voteNo * 100 > totalVotes * (100 - s.passPct)) {
            return "Rejected";
        } else {
            return "Tie";
        }
    }
}
