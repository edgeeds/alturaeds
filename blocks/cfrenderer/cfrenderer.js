function sanitiseHTML(htmlString) {
  if (!htmlString) return null;

  // Initialize a new DOMParser instance
  const parser = new DOMParser();

  // Parse the HTML string
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Remove any <script> tags to mitigate potential XSS attacks
  Array.from(doc.getElementsByTagName('script')).forEach((script) => script.remove());

  return doc.body.childNodes;
}
async function getContent(sURL) {
  if (!sURL) return null;
  let result;

  try {
    const url = new URL(sURL);
    const res = await fetch(url);
    const json = await res.json();
    result = sanitiseHTML(json?.data?.textBlockCfByPath?.item?.body?.html);
  } catch (error) {
    console.error('error occurred > ', error);
  }

  return result || 'No text';
}
export default async function decorate(block) {
  const queryElement = block.querySelector('a[href]');
  if (queryElement) {
    const queryURL = queryElement.href;
    const parentDiv = document.createElement('div');
    parentDiv.classList.add('cfrenderer-block');
    const nodeList = await getContent(queryURL);

    nodeList.forEach((node) => {
      parentDiv.appendChild(node.cloneNode(true));
    });

    // replace the default block with the above
    queryElement.replaceWith(parentDiv);
  }
}
