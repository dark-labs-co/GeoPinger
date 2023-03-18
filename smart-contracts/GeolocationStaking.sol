pragma solidity ^0.8.0;

contract GeolocationStaking {
    uint256 public constant MINIMUM_STAKE = 1 ether;

    struct Node {
        uint256 stake;  
        uint256 score;
        uint256 latitude;
        uint256 longitude;
        bool registered;
    }

    mapping(address => Node) public nodes;

    event NodeRegistered(address node);
    event NodeUnregistered(address node);
    event StakeIncreased(address node, uint256 amount);
    event StakeDecreased(address node, uint256 amount);
    event ScoreUpdated(address node, uint256 score);
    event LocationUpdated(address node, uint256 latitude, uint256 longitude);

    function registerNode(uint256 latitude, uint256 longitude) public payable {
        require(msg.value >= MINIMUM_STAKE, "Insufficient stake");
        require(!nodes[msg.sender].registered, "Node already registered");

        // require location
        require(latitude > 0, "Invalid latitude");
        require(longitude > 0, "Invalid longitude");
        

        nodes[msg.sender] = Node({
            stake: msg.value,
            score: 0,
            registered: true
            latitude: latitude,
            longitude: longitude
        });

        emit NodeRegistered(msg.sender);
    }

    function unregisterNode() public {
        Node storage node = nodes[msg.sender];
        require(node.registered, "Node not registered");

        uint256 stakeToReturn = node.stake;
        node.stake = 0;
        node.registered = false;

        (bool success, ) = msg.sender.call{value: stakeToReturn}("");
        require(success, "Failed to return stake");

        emit NodeUnregistered(msg.sender);
    }

    function updateLocation(uint256 latitude, uint256 longitude) public {
        Node storage node = nodes[msg.sender];
        require(node.registered, "Node not registered");

        // require location
        require(latitude > 0, "Invalid latitude");
        require(longitude > 0, "Invalid longitude");

        node.latitude = latitude;
        node.longitude = longitude;

        emit LocationUpdated(msg.sender, latitude, longitude);
    }

    function increaseStake() public payable {
        Node storage node = nodes[msg.sender];
        require(node.registered, "Node not registered");
        require(msg.value > 0, "Invalid stake amount");

        node.stake += msg.value;

        emit StakeIncreased(msg.sender, msg.value);
    }

    function decreaseStake(uint256 amount) public {
        Node storage node = nodes[msg.sender];
        require(node.registered, "Node not registered");
        require(amount > 0 && amount <= node.stake - MINIMUM_STAKE, "Invalid stake amount");

        node.stake -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to return stake");

        emit StakeDecreased(msg.sender, amount);
    }

    function updateScore(uint256 newScore) public {
        Node storage node = nodes[msg.sender];
        require(node.registered, "Node not registered");

        node.score = newScore;

        emit ScoreUpdated(msg.sender, newScore);
    }

    function getNodeInfo(address nodeAddress) public view returns (uint256 stake, uint256 score, bool registered, uint256 latitude, uint256 longitude) {
        Node storage node = nodes[nodeAddress];
        return (node.stake, node.score, node.registered, node.latitude, node.longitude);
    }
    

    uint256 public rewardPool;

    function depositReward() public payable {
        require(msg.value > 0, "Invalid reward amount");
        rewardPool += msg.value;
    }

    function getTotalContribution() public view returns (uint256) {
        uint256 totalContribution = 0;
        for (uint256 i = 0; i < nodes.length; i++) {
            Node storage node = nodes[i];
            if (node.registered) {
                totalContribution += node.stake * node.score;
            }
        }
        return totalContribution;
    }

    function distributeRewards() public {
        uint256 totalContribution = getTotalContribution();
        require(totalContribution > 0, "No contributions");
        for (uint256 i = 0; i < nodes.length; i++) {
            Node storage node = nodes[i];
            if (node.registered) {
                uint256 nodeContribution = node.stake * node.score;
                uint256 nodeReward = (rewardPool * nodeContribution) / totalContribution;
                rewardPool -= nodeReward;
                node.stake += nodeReward;
            }
        }
    }
}
