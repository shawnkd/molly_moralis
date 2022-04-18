import { Card, Video, Button, CardFooter } from "grommet";
//import { Favorite, Play, Chat, Like } from "grommet-icons";
import { useState } from "react";
import Header from "../../components/Header";
import ReactPlayer from "react-player";
import { Center, Text, VStack, HStack, Flex, Spacer } from "@chakra-ui/react";
//import { Value } from "grommet-controls";

export default function Post() {
  // States and variables
  const [like, setLike] = useState(5);
  const Like = () => {
    console.log("you liked a video");
  };
  return (
    <>
      <Card height="450px" width="800px" pad="large" background="dark-1">
        <Center>
          <Text pt="4">Stream Highlight</Text>
        </Center>

        {/*} <Video controls="over" fit="cover">
          <source
            // key="video"
            width="700px"
            height="400px"
            src="https://www.youtube.com/watch?v=bSMBiKcHPys"
            // type="video/mp4"
            //../../../public/twitchclip1.mp4
          />
  </Video> */}
        {/* <ReactPlayer
          width="700px"
          height="430px"
          controls
          url="https://www.youtube.com/watch?v=F2EfTe7YOT4"
        /> */}

        <CardFooter pad={{ horizontal: "small" }} background="light-2">
          <Flex>
            <VStack>
              <Spacer />
              <HStack>
                <HStack style={{ marginLeft: ".7rem" }}>
                  {/* <Play size="medium" color="black" /> */}
                  <Text>1023324</Text>
                  <br />
                </HStack>
                <br />

                <Button style={{ marginLeft: "2rem" }} onClick={Like}>
                  <HStack>
                    {/* <Favorite size="medium" color="red" /> */}
                    <h2>{like}</h2>
                  </HStack>
                </Button>

                <Button style={{ marginLeft: "2rem" }}>
                  <HStack>
                    {/* <Chat size="medium" color="blue" /> */}
                    <Text>125</Text>
                  </HStack>
                </Button>
              </HStack>
              <Spacer />
            </VStack>
          </Flex>
          {/* <Button icon={<Icons.ShareOption color="plain" />} hoverIndicator /> */}
        </CardFooter>
      </Card>
    </>
  );
}
