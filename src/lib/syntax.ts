import { Root } from "mdast";
import { Plugin } from "unified";
import { visit } from "unist-util-visit";

type Options = {};

export const remarkIndexedBlock: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, (node) => {
      console.log(node);
    });
  };
};
