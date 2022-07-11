import { Root } from "hast";
import { Plugin } from "unified";
import { Handler, toHast, all } from "mdast-util-to-hast";
import { IndexedBlock } from "./remark-syntax";

export const indexedBlock: Handler = (h, node) => {
  // console.log(h, node);
  return h(node, "div", { id: node.id }, all(h, node));
};
