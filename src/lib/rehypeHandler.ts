import { Handler, all } from "mdast-util-to-hast";

export const indexedBlock: Handler = (h, node) => {
  return h(node, "div", { id: node.id }, all(h, node));
};
