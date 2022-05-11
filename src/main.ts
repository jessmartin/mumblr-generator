import { IPFS, create } from 'ipfs-core';
import type { CID } from 'ipfs-core';
import { marked } from 'marked';

export default async function main() {
  console.log('Starting IPFS...');

  const ipfs = await create();
  const cid = 'bafybeid42tsayaxar7zjtt6cgp5prqxdripty4zcky6r5ekmm3qxi66daq';

  for await (const fileEntry of ipfs.ls(cid)) {
    console.log(fileEntry);
    // Grab the file's content
    const content = await readFile(ipfs, fileEntry.cid);

    // Transform the file's contents into HTML using marked
    const html = marked.parse(content.toString());

    console.log(html);
  }
}

const readFile = async (ipfs: IPFS, cid: CID): Promise<string> => {
  const decoder = new TextDecoder();
  let content = '';
  for await (const chunk of ipfs.cat(cid)) {
    content += decoder.decode(chunk);
  }

  return content;
};

main();
