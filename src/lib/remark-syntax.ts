import { Root, Paragraph, Content } from "mdast";
import { Plugin } from "unified";

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
    const newTree: Content[] = [];
    for (const child of tree.children) {
      if (child.type !== "heading") {
        const index = tree.children.indexOf(child);
        const indexedBlockId: Paragraph = {
          type: "paragraph",
          children: [
            {
              type: "text",
              value: `\[#${key}-${index}]`,
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
