import fs from "fs";
import { remark } from "remark";
import { remarkIndexedBlock } from "./build";

const buffer = fs.readFileSync("example.md");

const main = async () => {
  const file = await remark().use(remarkIndexedBlock).process(buffer);
  fs.writeFileSync("eample-gen.md", file.value);
};

main();
