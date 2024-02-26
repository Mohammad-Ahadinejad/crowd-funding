// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract CrowdFunding {
    struct Campaign{
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        string image;
        uint256 amountCollected;
        address[] donators;
        uint256[] donations;
    }

    mapping(uint256=>Campaign) private s_campaigns;
    uint256 private s_numberOfCampaigns;

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns(uint256) {
        require(_deadline > block.timestamp, "The deadline should be a date in the future.");
        Campaign storage newCampaign = s_campaigns[s_numberOfCampaigns];
        newCampaign.owner= _owner;
        newCampaign.title= _title;
        newCampaign.description= _description;
        newCampaign.target= _target;
        newCampaign.deadline= _deadline;
        newCampaign.image= _image;
        s_numberOfCampaigns++;
        return s_numberOfCampaigns-1;
    }

    function donateCampaign(uint256 _id) public payable {
        Campaign storage fundedCampaign = s_campaigns[_id];
        fundedCampaign.amountCollected += msg.value;
        fundedCampaign.donators.push(msg.sender);
        fundedCampaign.donations.push(msg.value);
        (bool success, ) = payable(fundedCampaign.owner).call{value: msg.value}("");
        require(success, "Funding Failed");
    }

    function getDonators(uint256 _id) public view returns(address[] memory, uint256[] memory) {
        return (s_campaigns[_id].donators, s_campaigns[_id].donations);
    }

    function getAllCampaigns() public view returns(Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](s_numberOfCampaigns);

        for(uint256 i=0; i<s_numberOfCampaigns; i++){
            allCampaigns[i]=s_campaigns[i];
        }
        return allCampaigns;
    }

}
