// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/NFTSwap.sol";
import "../src/deploy.sol";

contract NFTSwapTest is Test {
    NFTSwap nftswap;
    address nftaddress;
    address alice = makeAddr("alice");
    address bob = makeAddr("bob");
    address tony = makeAddr("tony");

    function setUp() public {
        vm.startPrank(alice);
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);

        nftswap = new NFTSwap();

        console.log("nftswap", address(nftswap));

        Deploy nft = new Deploy("test1", "test1");
        nft.mint(alice, 1);

        nftaddress = address(nft);

        vm.stopPrank();
    }

    function test_list() public {
        vm.startPrank(alice);
        console.log("alice", alice);

        //approve nft
        ERC721(nftaddress).approve(address(nftswap), 1);
        //list nft
        nftswap.list(nftaddress, 1, 1 ether);

        //check list
        (address seller, uint256 price) = nftswap.lists(nftaddress, 1);
        console.log("price", price);
        console.log("seller", seller);

        vm.stopPrank();
    }

    function test_buy() public {
        vm.startPrank(alice);
        console.log("alice", alice);

        //approve nft
        ERC721(nftaddress).approve(address(nftswap), 1);
        //list nft
        nftswap.list(nftaddress, 1, 1 ether);

        //check list
        (address seller, uint256 price) = nftswap.lists(nftaddress, 1);
        console.log("price", price);
        console.log("seller", seller);

        vm.stopPrank();

        vm.startPrank(bob);
        console.log("bob", bob);
        // buy nft
        nftswap.buy{value: 1 ether}(nftaddress, 1, 1 ether);

        //check nft owner
        address owner = IERC721(nftaddress).ownerOf(1);

        assertEq(owner, bob);
        assertEq(alice.balance, 101 ether);

        vm.stopPrank();
    }

    function test_update() public {
        vm.startPrank(alice);
        //approve nft
        ERC721(nftaddress).approve(address(nftswap), 1);
        //list nft
        nftswap.list(nftaddress, 1, 1 ether);

        //check list
        (address seller, uint256 price) = nftswap.lists(nftaddress, 1);
        console.log("price", price);
        console.log("seller", seller);

        console.log("owner", IERC721(nftaddress).ownerOf(1));
        console.log("alice", alice);

        //update price
        nftswap.update(nftaddress, 1, 2 ether);

        //check price
        (address seller1, uint256 price1) = nftswap.lists(nftaddress, 1);
        console.log("price1", price1);
        console.log("seller1", seller1);

        vm.stopPrank();
    }

    function test_cancel() public {
        vm.startPrank(alice);
        console.log("alice", alice);

        //approve nft
        ERC721(nftaddress).approve(address(nftswap), 1);
        //list nft
        nftswap.list(nftaddress, 1, 1 ether);

        //check list
        (address seller, uint256 price) = nftswap.lists(nftaddress, 1);
        console.log("price", price);
        console.log("seller", seller);

        //cancel
        nftswap.cancel(nftaddress, 1);

        //check list
        (address seller1, uint256 price1) = nftswap.lists(nftaddress, 1);
        console.log("price1", price1);
        console.log("seller1", seller1);

        vm.stopPrank();
    }
}
