import fs from "fs";
import { unified } from "unified";
import remarkParse from "remark-parse";

import { indexedBlock, remarkIndexedBlock } from "./build";
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

  const transformedHast = await unified()
    .use(remarkRehype, { handlers: { indexedBlock } })
    .run(transformedAst);

  const transformedHTML = unified()
    .use(rehypeStringify)
    .stringify(transformedHast);

  fs.writeFileSync("example-html.html", transformedHTML);
};

main();
