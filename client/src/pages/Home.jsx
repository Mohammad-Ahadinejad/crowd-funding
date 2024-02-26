import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import { DisplayCampaign } from "../components";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const { getCampaigns, address, contract } = useStateContext();

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [contract,address]);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  return (
    <DisplayCampaign
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
    />
  );
};

export default Home;
