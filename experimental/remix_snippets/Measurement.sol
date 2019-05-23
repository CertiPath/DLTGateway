pragma solidity >=0.4.22 <0.6.0;

contract Measurement {

    struct Location {
        string roomName;
        uint64 epochTime;
        string fahrenheit;
    }
    mapping(string => Location) public trackers;
    string updatedLocationName;
    string public contractVersion;
    constructor () public {
        contractVersion = '0.0.4';
    }

    function setLocation(string memory roomName, uint64 epochTime, string memory fahrenheit) public {
        updatedLocationName = roomName;
        trackers[updatedLocationName] = Location(roomName, epochTime, fahrenheit);
    }

    function getUpdatedLocationName() public view returns (string memory) {
        return updatedLocationName;
    }

    function getUpdatedTime() public view returns (uint64) {
        return trackers[updatedLocationName].epochTime;
    }

    function getUpdatedTemperature() public view returns (string memory) {
        return trackers[updatedLocationName].fahrenheit;
    }

}

// Contract address:  0xd11d10b290ad0b04369b3526bbe4e2991608c1e8
// Contract version: 0.0.5
// Block #313255
