import {
  Root,
  Paragraph,
  Blockquote,
  List,
  Table,
  Code,
  Image,
  Content,
} from "mdast";
import { Plugin } from "unified";
import { Node } from "unist-util-visit";
import util from "util";

type Options = {};

const key = "st1the";

export const remarkIndexedBlock: Plugin<[], Root> = () => {
  return (tree) => {
    const newTree: Content[] = [];
    for (const child of tree.children) {
      if (child.type !== "heading") {
        const index = tree.children.indexOf(child);
        const indexedBlockId: Paragraph = {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: `[[#${key}-${index}]]`,
            },
          ],
        };
        newTree.push(indexedBlockId);
      }
      newTree.push(child);
    }
    tree.children = newTree;

    return tree;
  };
};

type TargetBlock = Paragraph | Blockquote | List | Table | Code | Image;

const isTargetBlock = (node: Node): node is TargetBlock => {
  return (
    node.type === "paragraph" ||
    node.type === "blockquote" ||
    node.type === "list" ||
    node.type === "table" ||
    node.type === "code" ||
    node.type === "image"
  );
};
