import fs from "fs";
import { unified } from "unified";
import remarkParse from "remark-parse";

import {
  indexedBlock,
  indexedBlockChildren,
  remarkIndexedBlock,
  rehypeIndexedBlock,
} from "./build";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify/lib";

const buffer = fs.readFileSync("example.md");

const main = async () => {
  const ast = unified().use(remarkParse).parse(buffer);
  const transformedAst = await unified()
    .use(remarkIndexedBlock, {
      fileName: "example",
      domainName: "https://test.com",
    })
    .run(ast);

  const hast = await unified()
    .use(remarkRehype, { handlers: { indexedBlock, indexedBlockChildren } })
    .run(transformedAst);

  const transformedHast = unified().use(rehypeIndexedBlock).run(hast);

  const transformedHTML = unified()
    .use(rehypeStringify)
    .stringify(transformedHast);

  fs.writeFileSync("example-html.html", transformedHTML);
};

main();
