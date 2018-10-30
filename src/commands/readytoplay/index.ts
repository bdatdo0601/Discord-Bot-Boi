import debug from "debug";
import { Client, Message } from "discord.js";
import firebase from "firebase";
import { Command } from "../command.interface";

const debugLog = debug("BotBoi:ReadyToPlay");

const addUserToRDPCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    debugLog("adding users to RDP");
  },
  commandDescription: "add a mentioned users to Ready To Play role",
};

const removeUserFromRDPCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    debugLog("removing users from RDP");
  },
  commandDescription: "delete mentioned users from Ready To Play role",
};

const enableReadyToPlayCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    debugLog("enable RDP function");
  },
  commandDescription:
    "allow me to put members in channel on and off ReadyToPlay role",
};

const disableReadyToPlayCommand: Command = {
  commandCallback: async (
    client: Client,
    db: firebase.database.Database,
    query: string,
    message: Message,
  ) => {
    debugLog("disable RDP function");
  },
  commandDescription: "disable ready to play feature",
};
