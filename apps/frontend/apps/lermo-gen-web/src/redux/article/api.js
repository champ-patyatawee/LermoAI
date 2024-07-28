import Config from '@config';
import { Http, HttpAuth } from '@helpers/httpClient';

export default {
  getArticle() {
    const apiUrl = `${Config.API_ENDPOINT}/article`;
    return Http.get(apiUrl);
  },

  createArticle(data) {
    const apiUrl = `${Config.API_ENDPOINT}/article`;
    return Http.post(apiUrl, data);
  },

}