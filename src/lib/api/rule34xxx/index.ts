/**
 * lib/api/rule34xxx/index.ts
 *
 * Function to interact with Rule34xxx API
 */
import axios from "axios";
import parser, { JsonOptions } from "xml2json";
import {
  Rule34XXXImage,
  Rule34XXXParsedData,
  Rule34XXXRawImageData,
} from "./rule34xxx.interface";

const RULE_34_XXX_API = "https://rule34.xxx/index.php?page=dapi&s=post&q=index";

const xmlToJsonConfig: JsonOptions = {
  coerce: true,
  sanitize: true,
  trim: true,
};

/**
 * return a list of rule 34 images related to a given keyword
 *
 * @param {string} query a keyword to search for
 * @returns {Promise<Rule34XXXImage[]>} a list of rule 34 xxx images
 */
const getRule34XXXImgs = async (query: string): Promise<Rule34XXXImage[]> => {
  const response = await axios.get<string>(RULE_34_XXX_API, {
    params: {
      tags: query,
    },
  });
  const data = response.data;
  const parsedData: Rule34XXXParsedData = parser.toJson(data, {
    object: true,
    ...xmlToJsonConfig,
  }) as Rule34XXXParsedData;
  return parsedData.posts.post && parsedData.posts.post instanceof Array
    ? parsedData.posts.post.map<Rule34XXXImage>(
        (item: Rule34XXXRawImageData): Rule34XXXImage => {
          return {
            tags: item.tags.split(" "),
            url: item.file_url,
          };
        },
      )
    : [];
};
export default {
  getRule34XXXImgs,
};
