import { Heading, Center, useFormControlProps } from "@chakra-ui/react";
import Feed from "../../components/Feed";
import Header from "../../components/Header";
import ReactPlayer from "react-player";
import { useRouter } from "next/router";
import { Player } from "video-react";
import Footer from "../../components/Footer";
import styles from "../../styles/Home.module.css";
import { Card, TextInput, TextArea, FileInput } from "grommet";
import { create as ipfsHttpClient } from "ipfs-http-client";
import web3 from "web3";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ethers } from "ethers";
import { VStack, Spacer, HStack, Button, Input, Stack } from "@chakra-ui/react";
import { useMoralisFile, useMoralis } from "react-moralis";
const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

// Extra test
import { nftaddress, nftmarketaddress } from "../config";
import NFT from "../../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
// Extra test

export default function PostForm() {
  //const [title, setTitle] = useState('')
  const Moralis = require("moralis");
  const [Error, setError] = useState("");
  const [fileUrl, setFileUrl] = useState(null);
  const [description, setDescription] = useState("");
  const [editions, setEditions] = useState("");
  const [price, setPrice] = useState("");
  const [submit, setSubmit] = useState(false);
  const router = useRouter();
  const { user } = useMoralis();

  const [highlight, setHighlight] = useState({
    creatorAddress: "",
    title: "",
    description: "",
    file: [],
    editions: "",
    price: "",
  });
  const saveAsset = async () => {
    try {
      // save the video to ipfs
      const videodata = highlight.file;
      const vidfile = new Moralis.File(highlight.file.name, videodata);
      const savedVid = await vidfile.saveIPFS();
      console.log(savedVid);
      console.log("saved video to ipfs");
      // save the json to ipfs
      const jsonfile = new Moralis.File("file.json", {
        base64: btoa(JSON.stringify(highlight)),
      });

      const savedFile = await jsonfile.saveIPFS();
      console.log("i saved this file first", savedFile);
      console.log("saved json to ipfs");
    } catch (err) {
      setError(err);
      console.log("error error error error");
    }
  };

  const { error, isUploading, moralisFile, saveFile } = useMoralisFile();
  // adding files
  async function onChange(e) {
    const file = e.target.files[0];
    formik.setFieldValue("file", file);
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      file = null;
      setFileUrl(null);
      setError(error);
      console.log("Error uploading file: ", error);
    }
  }

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      file: [],
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required ⚠️"),
      description: Yup.string()
        .max(200, "Must be 200 characters or less")
        .required("Required ⚠️"),
      file: Yup.mixed()
        .required("We need a video!")
        .test("fileSize", "Your video is too big :(", (values) => {
          console.log(values.size);
          return values && values.size <= 262144000;
        }),
      editions: Yup.number().positive().integer().required("Required ⚠️"),
      price: Yup.number().positive().required("Required ⚠️"),
    }),
    onSubmit: (values) => {
      setTimeout(async () => {
        await setHighlight({
          creatorAddress: user.get("ethAddress").toString(),
          title: values.title,
          description: values.description,
          file: values.file,
          editions: values.editions,
          price: values.price,
        });

        //   console.log(values.title)
        //   console.log(values.description)
        //   console.log(values.file)
        //   console.log(values.editions)
        //   console.log(values.price)
      }, 400);
      //  console.log(highlight);
    },
  });

  return (
    <>
      <Header />
      <main className={styles.main}>
        <Card width="large" pad="large" background="dark-1">
          <VStack>
            <Center>
              <Heading>Create Highlight</Heading>
            </Center>
            <Spacer />

            <form onSubmit={formik.handleSubmit}>
              <Stack>
                <label htmlFor="title">Title</label>
                <TextInput
                  id="title"
                  type="text"
                  placeholder="Clip Name"
                  {...formik.getFieldProps("title")}
                />
                {formik.touched.title && formik.errors.title ? (
                  <div>{formik.errors.title}</div>
                ) : null}
                <Spacer />
                <Spacer />
                <label htmlFor="description">Description</label>
                <TextArea
                  placeholder='Description e.g "Warzone hits on points"'
                  id="description"
                  type="text"
                  {...formik.getFieldProps("description")}
                />
                {formik.touched.description && formik.errors.description ? (
                  <div>{formik.errors.description}</div>
                ) : null}
                <Spacer />
                <br />
                {fileUrl !== null && file !== null ? (
                  <>
                    <label htmlFor="text">Preview Clip</label>

                    <div style={{ border: "3px solid #6bf1a7" }} className=" ">
                      <ReactPlayer playing={true} controls url={fileUrl} />
                    </div>
                    {console.log(fileUrl)}
                  </>
                ) : (
                  console.log("not not null")
                )}

                <label htmlFor="text">Video Clip</label>
                <TextInput
                  id="file"
                  name="file"
                  type="file"
                  //(e) =>
                  //formik.setFieldValue("file", e.currentTarget.files[0])
                  onChange={onChange}
                />
                {formik.touched.file && formik.errors.file ? (
                  <div>{formik.errors.file}</div>
                ) : null}
                <Spacer />
                <label htmlFor="editions">Editions</label>
                <TextInput
                  placeholder='Supply of NFT e.g "2"'
                  id="editions"
                  type="int"
                  {...formik.getFieldProps("editions")}
                />
                {formik.touched.editions && formik.errors.editions ? (
                  <div>{formik.errors.editions}</div>
                ) : null}
                <Spacer />
                <label htmlFor="price">Price</label>
                <TextInput
                  id="price"
                  required
                  placeholder='Price in Matic e.g "0.1"'
                  type="number"
                  {...formik.getFieldProps("price")}
                />
                {formik.touched.price && formik.errors.price ? (
                  <div>{formik.errors.price}</div>
                ) : null}
                <Spacer />
                <Spacer />
                <Center>
                  <Button
                    onClick={() => {
                      saveAsset();
                      createMarket();
                    }}
                    colorScheme="blue"
                    type="submit"
                  >
                    Submit
                  </Button>
                </Center>
              </Stack>
            </form>
          </VStack>
        </Card>
        <Button
          onClick={() => {
            console.log("The check is", highlight);
          }}
        >
          check state
        </Button>
      </main>

      <Footer />
    </>
  );
}
