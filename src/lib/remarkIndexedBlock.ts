import { Root, Content } from "mdast";
import { Plugin } from "unified";

export type IndexedBlock = {
  type: "indexedBlock";
  id: string;
  children: Content[];
};

declare module "mdast" {
  interface BlockContentMap {
    IndexedBlock: IndexedBlock;
  }
}

type Options = {
  fileName: string;
  idGenerator?: (index: number, fileName: string) => string;
};

const key = "st1the";

export const remarkIndexedBlock: Plugin<[Options], Root> = (options) => {
  if (!options.fileName) {
    throw Error("filename option is requried");
  }

  return (tree) => {
    const newTree: Content[] = [];
    for (const child of tree.children) {
      if (child.type !== "heading") {
        const index = tree.children.indexOf(child);
        const indexedBlockId: IndexedBlock = {
          type: "indexedBlock",
          id: options.idGenerator
            ? options.idGenerator(index, options.fileName)
            : `${key}-${index}`,
          children: [child],
        };
        newTree.push(indexedBlockId);
      } else {
        newTree.push(child);
      }
    }
    tree.children = newTree;

    return tree;
  };
};
