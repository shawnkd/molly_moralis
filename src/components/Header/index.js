import { useMoralis } from "react-moralis";
import { useState } from "react";
import { AiOutlineCopy } from "react-icons/ai";
import { FaBeer } from "react-icons/fa";
import UAuth from "@uauth/js";
import {
  Button,
  Badge,
  Stack,
  HStack,
  Grid,
  Flex,
  Spacer,
  Text,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import { DropButton, Menu } from "grommet";

import { truncateAddress } from "../../utils/shortAddy";

export default function Header() {
  const uauth = new UAuth({
    clientID: process.env.REACT_APP_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scope: "openid wallet",
  });

  const App = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [user, setUser] = useState();

    useEffect(() => {
      setLoading(true);
      uauth
        .user()
        .then(setUser)
        .catch(() => {})
        .finally(() => setLoading(false));
    }, []);

    const handleLogin = () => {
      setLoading(true);
      uauth
        .loginWithPopup()
        .then(() => uauth.user().then(setUser))
        .catch(setError)
        .finally(() => setLoading(false));
    };

    const handleLogout = () => {
      setLoading(true);
      uauth
        .logout()
        .then(() => setUser(undefined))
        .catch(setError)
        .finally(() => setLoading(false));
    };

    if (loading) {
    }

    if (error) {
      console.error(error);
      return <App />;
    }

    if (user) {
    }
  };
  const {
    authenticate,
    isAuthenticated,
    logout,
    user,
    isWeb3Enabled,
    enableWeb3,
  } = useMoralis();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <Flex>
            <Text mt="5" fontSize="4xl">
              ColorPixels
            </Text>
            <Spacer />
            <HStack style={{ position: "relative", left: "10px" }}>
              <Link href="/">
                <DropButton
                  style={{ position: "relative", left: "20px" }}
                  label="Explore"
                ></DropButton>
              </Link>
              <Link href="/PostForm">
                <DropButton
                  style={{ position: "relative", left: "50px" }}
                  label="Mint"
                ></DropButton>
              </Link>
              <Link href="/Profile">
                <DropButton
                  style={{ position: "relative", left: "90px" }}
                  label="Profile"
                ></DropButton>
              </Link>
            </HStack>
            <Spacer />
            <HStack p="4">
              <Menu
                style={{ position: "relative", right: "20px" }}
                label={
                  <>
                    {" "}
                    <span>{truncateAddress(user.get("ethAddress"))}</span>{" "}
                  </>
                }
                items={[
                  {
                    label: (
                      <Button
                        width={170}
                        border={false}
                        colorScheme="blue"
                        rounded={false}
                        onClick={() => {
                          navigator.clipboard.writeText(user.get("ethAddress"));
                        }}
                      >
                        {
                          <>
                            <span>
                              {truncateAddress(user.get("ethAddress"))}
                            </span>{" "}
                            <span>&nbsp;&nbsp;&nbsp;</span>
                          </>
                        }

                        <AiOutlineCopy />
                      </Button>
                    ),
                    onClick: () => {},
                  },
                  {
                    label: (
                      <Button
                        width={170}
                        border={false}
                        style={{ marginTop: "10px" }}
                        rounded={false}
                        onClick={() => {
                          window.open(
                            `https://mumbai.polygonscan.com/address/${user.get(
                              "ethAddress"
                            )}`,
                            "_blank"
                          );
                        }}
                      >
                        {" "}
                        View on PolygonScan
                      </Button>
                    ),
                    onClick: () => {},
                  },
                  {
                    label: (
                      <>
                        {" "}
                        <Button width={170} border={false} rounded={false}>
                          {" "}
                          Polygon balance
                        </Button>
                        <br />
                      </>
                    ),
                    onClick: () => {},
                  },
                  {
                    label: (
                      <>
                        <Button
                          p="4"
                          style={{ position: "relative" }}
                          width={170}
                          border={false}
                          rounded={false}
                          colorScheme="blue"
                          onClick={logout}
                        >
                          {" "}
                          Logout{" "}
                        </Button>
                      </>
                    ),
                    onClick: () => {},
                  },
                ]}
              />
              {/* <h2>Welcome {user.get("username")}</h2> */}
              {/* <h1>Logged in as:</h1> */}

              <Button colorScheme="blue" onClick={logout}>
                {" "}
                Logout{" "}
              </Button>
            </HStack>
          </Flex>
        </>
      ) : (
        <Flex>
          <Text mt="4" fontSize="4xl">
            ColorPixels
          </Text>
          <Spacer />

          <Box mt="4" mr="4">
            <DropButton
              label="Log In"
              dropAlign={{ top: "bottom", right: "right" }}
              dropContent={
                <>
                  <Button
                    p="4"
                    mt="2"
                    rounded={false}
                    colorScheme="blue"
                    onClick={() => {
                      authenticate({ provider: "metamask" });
                    }}
                  >
                    Sign in with MetaMask
                  </Button>
                  <Button
                    p="4"
                    mt="2"
                    rounded={false}
                    colorScheme="blue"
                    onClick={() => {
                      authenticate({ provider: "walletconnect", chainId: 137 });
                    }}
                  >
                    Sign in with walletconnect
                  </Button>
                </>
              }
            />
          </Box>
        </Flex>
      )}
    </div>
  );
}
