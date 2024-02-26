import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useConnect,
  useContractWrite,
  metamaskWallet,
  useContractRead,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract(
    "0xFBE751d01Cb0Eb6d10705F471F0d2B78B1E23Eeb"
  );

  const address = useAddress();

  const metamaskConfig = metamaskWallet();
  const connect = useConnect();

  const publichCampaign = async (form) => {
    try {
      await contract.call("createCampaign", [
        address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ]);
      alert("Contract call success");
    } catch (error) {
      alert("Contract call failure");
    }
  };

  const getCampaigns = async () => {
    try {
      const campaigns = await contract.call("getAllCampaigns");
      const parsedCampaigns = campaigns.map((campaign, i) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: i,
      }));

      return parsedCampaigns;
    } catch (error) {
      //alert("Error fetching data");
    }
  };

  const getUserCampaigns = async () => {
    const campaigns = await getCampaigns();
    const filteredCampaigns = campaigns.filter(
      (campaign) => campaign.owner === address
    );
    return filteredCampaigns;
  };


  const donate = async (pId, amount) => {
    const data = await contract.call("donateCampaign", [pId], {value: ethers.utils.parseEther(amount)});
    return data;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        connect,
        metamaskConfig,
        createCampaign: publichCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
