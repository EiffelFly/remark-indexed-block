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

type IndexedBlock = {
  type: "IndexedBlock";
  id: string;
  children: Content[];
};

declare module "mdast" {
  interface BlockContentMap {
    IndexedBlock: IndexedBlock;
  }
}

type Options = {};

const key = "st1the";

export const remarkIndexedBlock: Plugin<[], Root> = () => {
  return (tree) => {
    const newTree = [];
    for (const child of tree.children) {
      if (child.type !== "heading") {
        const index = tree.children.indexOf(child);
        const indexedBlock: IndexedBlock = {
          id: `[#${key}-${index}]`,
          type: "IndexedBlock",
          children: [
            {
              type: "text",
              value: "hi",
            },
          ],
        };
        newTree.push(indexedBlock);
      }
      newTree.push(child);
    }
    tree.children = newTree;

    console.log(newTree);

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
