import { Root, Content } from "mdast";
import { Plugin } from "unified";
import { v5 as uuidv5 } from "uuid";

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
  domainName: string;
  idGenerator?: (index: number, fileName: string) => string;
};

export const remarkIndexedBlock: Plugin<[Options], Root> = (options) => {
  if (!options.fileName) {
    throw Error("fileName option is requried");
  }

  if (!options.domainName) {
    throw Error("domainName option is requried");
  }

  const perFileId = uuidv5(options.fileName, uuidv5.URL);

  return (tree) => {
    const newTree: Content[] = [];
    for (const child of tree.children) {
      if (child.type !== "heading") {
        const index = tree.children.indexOf(child);
        const indexedBlockId: IndexedBlock = {
          type: "indexedBlock",
          id: options.idGenerator
            ? options.idGenerator(index, options.fileName)
            : `${perFileId.slice(0, 6)}-${index}`,
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
