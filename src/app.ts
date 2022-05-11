import IPFS from 'ipfs';
// const IPFS = require('ipfs');
const makeIpfsFetch = require('ipfs-fetch');
const fetch = await makeIpfsFetch({ IPFS });

const response = await fetch(
  'ipfs://bafybeid42tsayaxar7zjtt6cgp5prqxdripty4zcky6r5ekmm3qxi66daq'
);
const text = await response.text();

console.log(text);
