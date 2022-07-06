import fs from "fs";
import { unified } from "unified";
import remarkParse from "remark-parse";

import { remarkIndexedBlock } from "./build";

const buffer = fs.readFileSync("example.md");

const main = async () => {
  const ast = unified().use(remarkParse).parse(buffer);
  const transformedAst = await unified().use(remarkIndexedBlock).run(ast);
  console.log(transformedAst);
};

main();
