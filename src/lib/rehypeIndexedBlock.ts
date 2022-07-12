import { Element, Root } from "hast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

type Options = {};

export const rehypeIndexedBlock: Plugin<[Options], Root> = () => {
  return (tree) => {
    visit(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "div" &&
        node.properties?.class?.toString().includes("indexed-block-container")
      ) {
        const idElement: Element = {
          type: "element",
          tagName: "p",
          properties: {
            class: "indexed-block-id",
          },
          children: [
            {
              type: "text",
              value: node.properties.id?.toString() ?? "",
            },
          ],
        };
        node.children.unshift(idElement);
      }
    });
  };
};
