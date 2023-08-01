// Try using this as URI ipfs://bafkreic6ov4qo4ucd4g4uuyve4h72nc4y2lg7ugtq3n3vxnfp3lojvtmdu

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol"; 

contract SoulBound is  ERC721URIStorage {
    address public owner;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    mapping(address => bool) public whitelistedAddresses;//whitlisted Address to mint token
    mapping(address => bool) public tokenMintedAddress;//address which have already minted token 
    event Attest(address indexed to, uint256 indexed tokenId);
    event Revoke(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("SoulBound Token", "SBT") {
        owner=msg.sender;
    }
    function addToWhiteList(address _add)public onlyOwner{
        require(!whitelistedAddresses[_add], "Sender has already been whitelisted");
         whitelistedAddresses[_add] = true;
    }
    modifier onlyOwner(){
        require(msg.sender==owner,"Not the owner");
        _;
    }
    modifier onlyWhitelistedUser(){
        require(whitelistedAddresses[msg.sender],"Could not mint the token");
        _;
    }
    function safeMint(string memory uri) public onlyWhitelistedUser {
         whitelistedAddresses[msg.sender]=false;
         tokenMintedAddress[msg.sender]=true;
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
       
    }

    function burn(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Only owner of the token can burn it");
        _burn(tokenId);
    }

    function revoke(uint256 tokenId) external onlyOwner {
        _burn(tokenId);
    }

     function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721)
    {
        require(from == address(0), "Token not transferable");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override( ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override( ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    function hasToken()public view returns (bool){
        return tokenMintedAddress[msg.sender];
    }
}

