import parser from "xml2json";
import _ from "lodash";
import rule34Keywords from "./data/rule34Keywords";
import API from "./api";

export const getLewlImages = async (
    client,
    query = rule34Keywords[Math.floor(Math.random() * rule34Keywords.length)],
    amount = 10,
    receiver = null
) => {
    const rawData = await API.get34Imgs(query);
    if (!receiver) {
        client.guilds.array().forEach(guild => {
            const nsfwChannel = guild.channels.array().find(channel => channel.nsfw);
            nsfwChannel.send(`The topic is ${query}`);
        });
    } else {
        receiver.send(`The topic is ${query}`);
    }
    const data = JSON.parse(parser.toJson(rawData.data));
    const receivedData = data.posts.post ? data.posts.post : [];
    const dataToPost = receivedData.length > amount ? _.shuffle(receivedData).slice(0, amount) : receivedData;
    if (dataToPost.length <= 0) {
        if (!receiver) {
            client.guilds.array().forEach(guild => {
                const nsfwChannel = guild.channels.array().find(channel => channel.nsfw);
                nsfwChannel.send("My DB does not have dis");
            });
        } else {
            receiver.send("My DB does not have dis");
        }
    } else {
        const sendingData = dataToPost instanceof Array ? dataToPost : [dataToPost];
        sendingData.forEach(item => {
            if (item.file_url) {
                if (!receiver) {
                    client.guilds.array().forEach(guild => {
                        const nsfwChannel = guild.channels.array().find(channel => channel.nsfw);
                        nsfwChannel.send(item.file_url);
                    });
                } else {
                    receiver.send(item.file_url);
                }
            }
        });
    }
};
