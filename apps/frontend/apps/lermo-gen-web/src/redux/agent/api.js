import Config from '@config';
import { Http, HttpAuth } from '@helpers/httpClient';

export default {
  getAgent() {
    const apiUrl = `${Config.API_ENDPOINT}/agent`;
    return Http.get(apiUrl);
  },
}