"use client";

import { useState } from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

import RoomsList from "../../components/RoomsList";
import CamerasList from "../../components/CamerasList";
import AddCameraForm from "../../components/AddCamera";
import Layout from "../Layout";
import style from "../../styles/RoomsCameras.module.css";

const RoomsCameras = () => {
  const [activeTab, setActiveTab] = useState("rooms");

  return (
    <Layout>
      <Box className={style.container}>
        <Heading as="h1" className={style.mb6}>
          Faculty Surveillance Management
        </Heading>

        <Flex
          className={`${style.flex} ${style.flexWrap} ${style.gap2} ${style.mb6}`}
        >
          <button
            className={`${style.navButton} ${
              activeTab === "rooms" ? style.active : ""
            }`}
            onClick={() => setActiveTab("rooms")}
          >
            Rooms
          </button>
          <button
            className={`${style.navButton} ${
              activeTab === "cameras" ? style.active : ""
            }`}
            onClick={() => setActiveTab("cameras")}
          >
            Cameras
          </button>
          <button
            className={`${style.navButton} ${
              activeTab === "add" ? style.active : ""
            }`}
            onClick={() => setActiveTab("add")}
          >
            Add Camera
          </button>
        </Flex>

        <Box
          className={`${style.tabContent} ${
            activeTab === "rooms" ? style.active : ""
          }`}
        >
          <Flex
            className={`${style.flex} ${style.mb4} ${style.itemsCenter} ${style.justifyBetween}`}
          >
            <Heading as="h2" className={style.text2xl}>
              Faculty Rooms
            </Heading>
          </Flex>
          <RoomsList />
        </Box>

        <Box
          className={`${style.tabContent} ${
            activeTab === "cameras" ? style.active : ""
          }`}
        >
          <Flex
            className={`${style.flex} ${style.mb4} ${style.itemsCenter} ${style.justifyBetween}`}
          >
            <Heading as="h2" className={style.text2xl}>
              Surveillance Cameras
            </Heading>
          </Flex>
          <CamerasList />
        </Box>

        <Box
          className={`${style.tabContent} ${
            activeTab === "add" ? style.active : ""
          }`}
        >
          <Box className={style.mb4}>
            <Heading as="h2" className={style.text2xl}>
              Add New Camera
            </Heading>
            <Text className={style.textMuted}>
              Register a new surveillance camera and associate it with a room
            </Text>
          </Box>
          <AddCameraForm />
        </Box>
      </Box>
    </Layout>
  );
};

export default RoomsCameras;
