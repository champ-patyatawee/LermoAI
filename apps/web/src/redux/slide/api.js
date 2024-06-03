import Config from '@config';
import { Http, HttpAuth } from '@helpers/httpClient';

export default {
  getSlide() {
    const apiUrl = `${Config.API_ENDPOINT}/slide`;
    return Http.get(apiUrl);
  },

  createSlide(data) {
    const apiUrl = `${Config.API_ENDPOINT}/slide`;
    return Http.post(apiUrl, data);
  },

  updateSlide(data) {
    const apiUrl = `${Config.API_ENDPOINT}/slide`;
    return Http.patch(apiUrl, data);
  }
}