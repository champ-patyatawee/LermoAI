import Config from '@config';
import { Http, HttpAuth } from '@helpers/httpClient';

export default {
  getPodcast() {
    const apiUrl = `${Config.API_ENDPOINT}/podcast`;
    return Http.get(apiUrl);
  },

  createPodcast(data) {
    const apiUrl = `${Config.API_ENDPOINT}/podcast`;
    return Http.post(apiUrl, data);
  },

  updatePodcast(data) {
    const apiUrl = `${Config.API_ENDPOINT}/podcast`;
    return Http.patch(apiUrl, data);
  }
}