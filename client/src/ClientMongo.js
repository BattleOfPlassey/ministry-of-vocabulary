/* eslint-disable no-undef */
import * as env from './config'
function search(query, cb) {
  return fetch(`${env.HOST}/api/articles/words?q=${query}`, {
    
    accept: "application/json"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  // console.log(response);
  return response.json([]);
}

const Client = { search };
export default Client;
