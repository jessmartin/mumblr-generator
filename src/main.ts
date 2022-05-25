import { IPFS, create } from 'ipfs-core';
import type { CID } from 'ipfs-core';
import { marked } from 'marked';
import fs from 'fs';
const jsdom = require('jsdom'); // Consider replacing with linkedom
const { JSDOM } = jsdom;
const fm = require('front-matter');

export default async function main() {
  console.log('Starting IPFS...');
  const ipfs = await create();

  // The CID for the folder containing the markdown files
  const cid = 'bafybeie62oukwmw2vl3musknzib4eyahytw46nogi6dzo66jd6czvokbyu';

  let blogPostHtml = '';

  let markdownFiles: string[] = [];

  // Collect the files and their timestamps
  for await (const fileEntry of ipfs.ls(cid)) {
    console.log('Parsing ' + fileEntry.name);
    // Grab the file's content
    const content = await readFile(ipfs, fileEntry.cid);

    markdownFiles.push(content);
  }

  // Sort the files by timestamp
  // TODO: Change `posted_at` to `postedAt` because JavaScript
  markdownFiles.sort((a, b) => {
    // TODO: Handle empty frontmatter
    const aFm = fm(a);
    const bFm = fm(b);

    // TODO: Handle empty `posted_at` attributes
    return (
      new Date(bFm.attributes.posted_at).getTime() -
      new Date(aFm.attributes.posted_at).getTime()
    );
  });

  // Parse the markdown files into HTML
  for await (const markdownFile of markdownFiles) {
    // Transform the file's contents into HTML
    const postDate = fm(markdownFile).attributes.posted_at;

    // TODO: Ignore the frontmatter or strip it off or something?
    const updateItem = new JSDOM(`
      <div class="update">
        <div class="update-t" data-timestamp="???">
          <a class="datestamp" href="???" title="Updates on this date">${postDate.toLocaleString(
            'en-us',
            { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }
          )}</a>
          <a class="clockstamp" href="/updates/???" title="Permalink to this update">???</a>
        </div>
        <div class="update-s">
          ${marked.parse(markdownFile.toString())}
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
