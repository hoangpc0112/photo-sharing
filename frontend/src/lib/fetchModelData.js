/**
 * fetchModel - Fetch a model from the web server.
 *
 * @param {string} url      The URL to issue the GET request.
 *
 */
async function fetchModel(url) {
  const models = await fetch("http://localhost:8081/api" + url);
  const data = await models.json();
  return data;
}

export default fetchModel;
