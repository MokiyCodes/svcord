let proxy = 'http://127.0.0.1:8080/'; // https://cors-anywhere.herokuapp.com/
export const setProxy = (newProxy:string) =>proxy = newProxy;
export const proxyFetch: typeof fetch = async (inpUrl, inpData) => {
  const underlyingFetchResponse = fetch(proxy + inpUrl, inpData);
  return underlyingFetchResponse;
};
export default proxyFetch;
