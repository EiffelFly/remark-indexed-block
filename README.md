# Markdown indexed block

This lib will annotate every block in the markdown file with site wise unique identifier and generate HTML accroding to the new markdown.

It contains two elements, a remark plugin and a set of rehype handler. The remark plugin introduce two new node type:

- IndexedBlock
- IndexedBlockChildren

And we have two rehype handlers for these two types to generate apporiate HTML.

## How to use

### Regular flow

```js
const buffer = fs.readFileSync("example.md");

const file = await unified()
  .use(remarkParse)
  .use(remarkIndexedBlock, {
    fileName: "<the target markdown fileName>",
    domainName: "the site's domain name",
  })
  .use(remarkRehype, { handlers: { indexedBlock, indexedBlockChildren } })
  .use(rehypeStringify)
  .process(buffer);

fs.writeFileSync("example-html.html", file.value);
```

### Dev flow

If you want to know how remark and rehype operate at different stage, you could use this flow.

```js
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

const transformedHast = await unified().use(rehypeIndexedBlock).run(hast);

const transformedHTML = unified()
  .use(rehypeStringify)
  .stringify(transformedHast);
```

## How it works

1. It will use the input fileName to tokenize the identifier, you can input with path like `path/to/blog/post/hi-i-am-indexed-block`
2. It will use the first 6 character as the prefix.
3. The suffix is depend on the order of the section.

```md
# Header 1

## Sub Header 1

hi, I am a block!

> I am a blockquote
```

Every unique representation will be a block besides from every header, take above markdown for example, the `hi, I am a block!` and `> I am a blockquote` are two separated blocks, but `# Header 1` and `## Sub Header 1` are not block. The suffix will be determined by their order. If the calculated prefix is r43erf the overall index of `hi, I am a block!` will be `r43erf-3`

## Worth notice Caveat

- Because remark is a esm module, we have to keep an eye one that:
  - We use `tsc` to build the package and imply that we are using esm by type config in package.json `type: "module"`
  - When testing the plugin, we run the script with `node`, but node is running with CommonJS by default, you need to imply that you want to run with esm by this flag `--experimental-specifier-resolution=node`
- unified.parse will generate a syntax tree, but does not run plugins/transformers.
  - ref: https://github.com/unifiedjs/unified/discussions/162
  - If you want unified to run plugin you could write something like this
  ```js
  const ast = unified().use(remarkParse).parse(buffer);
  const transformedAst = await unified().use(remarkIndexedBlock).run(ast);
  ```
- You could declare custom node type

  ```js
    type IndexedBlock = {
      type: "IndexedBlock";
      id: string;
      children: Content[];
    };

    declare module "mdast" {
      interface BlockContentMap {
        indexedBlock: IndexedBlock;
      }
    }
  ```
