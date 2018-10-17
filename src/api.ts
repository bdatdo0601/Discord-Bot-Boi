import axios from "axios";

const RULE_34_XXX_API = "https://rule34.xxx/index.php?page=dapi&s=post&q=index";

const get34Imgs = async query =>
    await axios.get(RULE_34_XXX_API, {
        params: {
            tags: query,
        },
    });

export default {
    get34Imgs,
};
