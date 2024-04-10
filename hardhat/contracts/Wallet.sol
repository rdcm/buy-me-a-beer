// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Wallet {
    address public owner;

    event Withdrawal(uint amount, uint when);
    event Received(uint amount, uint when);

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        emit Received(msg.value, block.timestamp);
    }

    modifier onlyOwner(address _to) {
        require(owner == msg.sender, "fuck off");
        require(_to != address(0), "fuck off again");
        _;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function topUp() external payable {
        emit Received(msg.value, block.timestamp);
    }

    function withdraw(address payable _to) external onlyOwner(_to) payable  {
        uint balance = getBalance();
        _to.transfer(balance);
        emit Withdrawal(balance, block.timestamp);
    }
}
