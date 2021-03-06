import { Button, Heading, InputGroup } from "@chakra-ui/react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import styles from "../../styles/Home.module.css";
import React, { useEffect } from "react";
import Paper from "@material-ui/core/Paper";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Card, TextInput, TextArea, FileInput } from "grommet";
import { Box } from "@chakra-ui/react";
import { DropButton } from "grommet";
import PostForm from "../PostForm";
import { useState } from "react";
import { ethers } from "ethers";
import { useMoralisFile, useMoralis } from "react-moralis";
import { Input } from "degen";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");
const Moralis = require("moralis");
export default function Profile() {
  const [values, setValues] = useState({
    tokenAddress: "0xb9c6e785695c9f13e399a89bf04e124d6415b0a8",
    tokenId: "1",
  });

  const getAsset = async () => {
    const res = await Moralis.Plugins.opensea.getAsset({
      network: "testnet",
      tokenAddress: values.tokenAddress,
      tokenId: values.tokenId,
    });
    console.log(res);
  };

  const getOrder = async () => {
    const res = await Moralis.Plugins.opensea.getOrders({
      network: "testnet",
      tokenAddress: values.tokenAddress,
      tokenId: values.tokenId,
      orderSide: 0,
      page: 1, // pagination shows 20 orders each page
    });
    console.log(res);
  };

  const createSellOrder = async () => {
    await Moralis.Plugins.opensea.createSellOrder({
      network: "testnet",
      tokenAddress: values.tokenAddress,
      tokenId: values.tokenId,
      amount: 0.0001,
      tokenType: "ERC721",
      userAddress: user.get("ethAddress"),
      paymentTokenAddress: "0xc778417e063141139fce010982780140aa0cd5ab", // Only set if you startAmount > endAmount
    });

    console.log("Create Sell Order Successful");
  };
  const createBuyOrder = async () => {
    await Moralis.Plugins.opensea.createBuyOrder({
      network: "testnet",
      tokenAddress: values.tokenAddress,
      tokenId: values.tokenId,
      tokenType: "ERC721",
      amount: 0.0001,
      userAddress: user.get("ethAddress"),
      paymentTokenAddress: "0xc778417e063141139fce010982780140aa0cd5ab",
    });

    console.log("Create Buy Order Successful");
  };

  const [fileUrl, setFileUrl] = useState(null);
  const [value, setValue] = React.useState(0);
  const [Error, setError] = React.useState(null);
  const [pic, setPic] = useState();
  var file;
  let profilePic;

  async function onChange(e) {
    file = e.target.files[0];

    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const { isInitialized, isAuthenticated, user } = useMoralis();
  // const ShowFile = () => {
  //   console.log(fileUrl);
  // if (fileUrl !== null) {

  // }
  // };

  const setMode = async () => {
    if (fileUrl === null) return;
    // showFile();
    // setshowFile(true);
    try {
      profilePic = new Moralis.Object("profilePic");
      console.log("created moralis object");
      profilePic.set("owner", user.get("ethAddress"));
      profilePic.set("pic", fileUrl);
      const uploadedPFP = await profilePic.save();
      console.log(uploadedPFP);
      console.log("uploaded a profile pic");
    } catch (e) {
      setError(e);
    }
  };

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      //showFile();
      LoadPic();
    }
  }, [isInitialized, isAuthenticated]);
  const handleSubmit = () => {};

  async function LoadPic() {
    const fetchpic = new Moralis.Query("profilePic");
    let test = await fetchpic.subscribe();
    console.log(test);
    await fetchpic.equalTo("owner", user.get("ethAddress"));
    const picresult = await fetchpic.find();
    // console.log(picresult);
    if (picresult.length < 1) return;
    setPic(picresult[picresult.length - 1].get("pic"));
    console.log(pic);
    /*
      profilePic.equalTo("owner", user.get("ethAddress"));
    const result = await profilePic.find();
    const fileurl = result[0].get("fileUrl");
    console.log(fileurl);
    */
  }
  return (
    <>
      <Header />
      <br />
      {isAuthenticated ? (
        <Heading className={styles.head}>Profile</Heading>
      ) : null}
      <main className={styles.main}>
        {isAuthenticated ? (
          <div>
            {fileUrl !== null ? (
              <img
                alt=""
                className="rounded mt-4"
                style={{ height: "320px", width: "350px" }}
                src={fileUrl}
              />
            ) : (
              <>
                {pic !== undefined ? (
                  <img
                    alt=""
                    className="rounded mt-4"
                    style={{ height: "320px", width: "350px" }}
                    src={pic}
                  />
                ) : null}{" "}
              </>
            )}
          </div>
        ) : null}
        <br />
        {isAuthenticated ? (
          <>
            <Box>
              <DropButton
                label="Change Pic"
                dropAlign={{ right: "left" | "right", top: "bottom" }}
                dropContent={
                  <>
                    <input
                      required
                      type="file"
                      name="NFT"
                      className="my-2"
                      onChange={onChange}
                    />
                    <Button p="2" mt="2" onClick={setMode}>
                      {" "}
                      Save
                    </Button>
                  </>
                }
              />
            </Box>
          </>
        ) : null}
        <br />
        {isAuthenticated ? (
          <>
            {user.get("ethAddress")}
            <br />
            <br />
            <div id="login">
              <form onSubmit={handleSubmit}>
                <label>
                  NFT contract address:&nbsp;
                  <input
                    type="text"
                    value={values.tokenAddress}
                    onChange={(e) =>
                      setValues({ tokenAddress: e.target.value })
                    }
                  />
                  <br />
                  <br />
                  Token Id: &nbsp;
                  <input
                    type="text"
                    value={values.tokenId}
                    onChange={(e) => setValues({ tokenId: e.target.value })}
                  />
                </label>
              </form>
            </div>
            <br />
            <Button onClick={getAsset}>get Asset with opensea plugin</Button>
            <br />
            <Button onClick={getOrder}>get Order with opensea plugin</Button>
            <br />
            <Button onClick={createSellOrder}>
              createSellOrder with opensea plugin
            </Button>
            <br />
            <Button onClick={createBuyOrder}>
              createBuyOrder with opensea plugin
            </Button>
            <br />
            <div className="">
              <div>
                <Paper square>
                  <Tabs
                    value={value}
                    textColor="primary"
                    indicatorColor="primary"
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                  >
                    <Tab label="Videos Minted" />
                    <Tab label="Videos Owned" />
                    <Tab label="Videos Sold" />
                    <Tab label="All Videos" />
                  </Tabs>
                  <br />
                  {value === 0 ? (
                    <>
                      <div>probably videos i have minted</div>
                    </>
                  ) : null}
                  {value === 1 ? (
                    <>
                      <div>probably videos i own</div>
                    </>
                  ) : null}
                  {value === 2 ? (
                    <>
                      <div>probably videos i have sold</div>
                    </>
                  ) : null}
                  {value === 3 ? (
                    <>
                      <div>probably everthing i do here</div>
                    </>
                  ) : null}
                </Paper>
              </div>
            </div>
          </>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
