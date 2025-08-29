// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";
import {Deploy} from "../src/deploy.sol";
import {console} from "forge-std/console.sol";

contract DeployNFTScript is Script {
    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployPrivateKey);

        address deployer = address(new Deploy("0xJuJu", "0xJuJu"));

        console.log("Deployer: ", deployer);
        vm.stopBroadcast();
    }
}
