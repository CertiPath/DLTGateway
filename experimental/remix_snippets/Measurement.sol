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

// Contract v. 0.0.4
// Address: 0xdf2c2fc9f2e748b5442a18ad7d51071bd4a62e53
// Deployed information:
// [block:310679 txIndex:0]from:0xc69...a7f9bto:Measurement.(constructor)value:0 weidata:0x608...90029logs:0hash:0xf1d...ccc86
// Debug
//  status 	0x1 Transaction mined and execution succeed
//  transaction hash 	0xf1d238d0dd7838a2f0b1bb40cddfb97147a1cb2cad27507c6033d067818ccc86
//  from 	0xc69793aa166587319cc411215965161a788a7f9b
//  to 	Measurement.(constructor)
//  gas 	737716 gas
//  transaction cost 	737716 gas
//  hash 	0xf1d238d0dd7838a2f0b1bb40cddfb97147a1cb2cad27507c6033d067818ccc86
//  input 	0x608...90029
//  decoded input 	{}
//  decoded output 	 -
//  logs 	[]
//  value 	0 wei
