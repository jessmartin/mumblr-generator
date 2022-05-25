import { IPFS, create } from 'ipfs-core';
import type { CID } from 'ipfs-core';
import { marked } from 'marked';
import fs from 'fs';
import { FrontMatterResult } from 'front-matter';
const jsdom = require('jsdom'); // Consider replacing with linkedom
const { JSDOM } = jsdom;
const fm = require('front-matter');

export default async function main() {
  console.log('Starting IPFS...');
  const ipfs = await create();

  // The CID for the folder containing the markdown files
  // TODO: Figure out how to get a CID from a stable name
  const cid = 'bafybeiapsyyb75hawqhrqng53ilkh62gzdjhlx373r5odmyljfghirjnsa';

  let blogPostHtml = '';

  let markdownFiles: string[] = [];

  // Collect the files and their timestamps
  for await (const fileEntry of ipfs.ls(cid)) {
    console.log('Parsing ' + fileEntry.name);
    // Grab the file's content
    const content = await readFile(ipfs, fileEntry.cid);

    // Ignore files that don't have postedAt
    const contentFm = fm(content);
    if (contentFm.attributes.postedAt === undefined) {
      continue;
    }

    markdownFiles.push(content);
  }

  // Ignore files that don't have frontmatter

  // Sort the files by timestamp
  // TODO: Write tests for this
  markdownFiles.sort((a, b) => {
    const aFm = fm(a);
    const bFm = fm(b);

    return (
      new Date(bFm.attributes.postedAt).getTime() -
      new Date(aFm.attributes.postedAt).getTime()
    );
  });

  // Parse the markdown files into HTML
  for await (const markdownFile of markdownFiles) {
    // Transform the file's contents into HTML
    const postDate = fm(markdownFile).attributes.postedAt;
    const contentString = markdownFile.toString();

    const updateItem = new JSDOM(`
      <div class="update">
        <div class="update-t" data-timestamp="#">
          <a class="datestamp" href="#" title="Updates on this date">${postDate.toLocaleString(
            'en-us',
            { year: 'numeric', month: 'numeric', day: 'numeric' }
          )}</a>
          <!-- <a class="clockstamp" href="/updates/???" title="Permalink to this update">???</a> -->
        </div>
        <div class="update-s">
          ${marked.parse(
            contentString.slice(contentString.indexOf('---', 4) + 4)
          )}
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
