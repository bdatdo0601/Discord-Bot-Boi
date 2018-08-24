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
    const data = JSON.parse(parser.toJson(rawData.data));
    const dataToPost = _.shuffle(data.posts.post).slice(0, amount);
    dataToPost.forEach(item => {
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
};
