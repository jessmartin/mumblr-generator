import { IPFS, create } from 'ipfs-core';
import type { CID } from 'ipfs-core';
import { marked } from 'marked';
import fs from 'fs';

const jsdom = require('jsdom'); // Consider replacing with linkedom
const { JSDOM } = jsdom;

export default async function main() {
  console.log('Starting IPFS...');
  const ipfs = await create();

  // The CID for the folder containing the markdown files
  const cid = 'bafybeih3yplpf4rtzh2xncwmsxlvoftbaj45agbpt3jga234vperrrmbjq';

  let blogPostHtml = '';
  for await (const fileEntry of ipfs.ls(cid)) {
    console.log('Parsing ' + fileEntry.name);
    // Grab the file's content
    const content = await readFile(ipfs, fileEntry.cid);

    // Transform the file's contents into HTML using marked
    const updateItem = new JSDOM(`
      <div class="update">
        <div class="update-t" data-timestamp="???">
          <a class="datestamp" href="???" title="Updates on this date">???</a>
          <a class="clockstamp" href="/updates/???" title="Permalink to this update">???</a>
        </div>
        <div class="update-s">
          ${marked.parse(content.toString())}
        </div>
      </div>`);

    blogPostHtml += updateItem.serialize();
  }
  console.log(blogPostHtml);

  try {
    const html = fs.readFileSync('./src/template.html', 'utf8');
    const dom = new JSDOM(html);
    const body = dom.window.document.querySelector('div.feed');
    body.innerHTML = blogPostHtml;

    fs.writeFileSync('./public/index.html', dom.serialize());
  } catch (e) {
    console.log(e);
  }

  console.log('All finished!');
  process.exit();
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
