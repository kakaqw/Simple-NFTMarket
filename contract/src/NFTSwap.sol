// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.19;

import "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721Receiver.sol";
import "lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import "lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";

contract NFTSwap is IERC721Receiver, ReentrancyGuard {
    event List(
        //上架事件
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event Buy(
        //购买事件
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event Update(
        //更新事件
        address indexed updater,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );
    event Cancel(
        //取消事件
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    receive() external payable {}

    //订单结构体，包含卖家和价格
    struct Order {
        address seller;
        uint256 price;
    }
    //订单映射，NFT合约 》tokenid 》订单结构体
    mapping(address => mapping(uint256 => Order)) public lists;
    //是否上架映射，NFT合约 》tokenid 》是否上架
    mapping(address => mapping(uint256 => bool)) public isList;

    //检查时否是NFT的合约
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    //上架NFT
    function list(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price
    ) external {
        //检查NFT是持有者
        require(
            IERC721(_nftAddress).ownerOf(_tokenId) == msg.sender,
            "NFT is not owned by the seller"
        );

        //检查NFT是否被批准
        require(
            IERC721(_nftAddress).getApproved(_tokenId) == address(this),
            "NFT is not approved"
        );

        Order memory order;
        order.seller = msg.sender;
        order.price = _price;
        lists[_nftAddress][_tokenId] = order;
        isList[_nftAddress][_tokenId] = true;

        emit List(msg.sender, _nftAddress, _tokenId, _price);
    }

    //购买NFT
    function buy(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price
    ) external payable nonReentrant {
        //通过缓存获取list信息，并且比映射更省gas
        Order memory order = lists[_nftAddress][_tokenId];

        //检查NFT是否上架
        require(
            order.seller != address(0) && order.price != 0,
            "NFT is not listed"
        );
        //检查是否支付
        require(msg.value == order.price, "Price is not correct");
        //检查是否是卖家自己购买
        require(msg.sender != order.seller, "Cannot buy your own NFT");

        //检查NFT是否还在owner手上
        require(
            IERC721(_nftAddress).ownerOf(_tokenId) == order.seller,
            "NFT owner is change"
        );

        //删除订单
        delete lists[_nftAddress][_tokenId];

        isList[_nftAddress][_tokenId] = false;

        //转移NFT
        IERC721(_nftAddress).safeTransferFrom(
            order.seller,
            msg.sender,
            _tokenId
        );

        //转移ETH
        (bool success, ) = payable(order.seller).call{value: _price}("");

        require(success, "Transfer failed");

        emit Buy(msg.sender, _nftAddress, _tokenId, _price);
    }

    function update(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price
    ) external {
        //查看msg.sender是否是卖家
        require(
            msg.sender == lists[_nftAddress][_tokenId].seller,
            "Only the seller can update "
        );
        //查看NFT是否还在owner手上
        require(
            msg.sender == IERC721(_nftAddress).ownerOf(_tokenId),
            "NFT owner is chenge"
        );
        //更新价格
        lists[_nftAddress][_tokenId].price = _price;

        emit Update(msg.sender, _nftAddress, _tokenId, _price);
    }

    function cancel(address _nftAddress, uint256 _tokenId) external {
        //检查msg.sender是否是卖家
        require(
            msg.sender == lists[_nftAddress][_tokenId].seller,
            "Only the seller can cancel"
        );
        //检查NFT是否还在owner手上
        require(
            IERC721(_nftAddress).ownerOf(_tokenId) == msg.sender,
            "NFT owner is change"
        );
        //删除订单
        delete lists[_nftAddress][_tokenId];

        isList[_nftAddress][_tokenId] = false;

        emit Cancel(msg.sender, _nftAddress, _tokenId);
    }
}
