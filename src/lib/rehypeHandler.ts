import { Handler, all } from "mdast-util-to-hast";

export const indexedBlock: Handler = (h, node) => {
  return h(
    node,
    "div",
    { id: node.id, class: "indexed-block-container" },
    all(h, node)
  );
};

export const indexedBlockChildren: Handler = (h, node) => {
  console.log(node);
  return h(node, "div", { class: "indexed-block-children" }, all(h, node));
};
