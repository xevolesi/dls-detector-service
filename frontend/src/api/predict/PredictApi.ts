import { AxiosInstance } from 'axios';

import { TBox } from '../../types';

export class PredictApi {
  constructor(private axiosInstance: AxiosInstance) {}

  private static getFormData(file: File) {
    const data = new FormData();
    data.append('file', file);

    return data;
  }

  boxes(file: File) {
    return this.axiosInstance
      .post<TBox[]>('predict/boxes', PredictApi.getFormData(file))
      .then((res) => res.data);
  }

  video(file: File) {
    return this.axiosInstance
      .post<string>('predict/video', PredictApi.getFormData(file))
      .then((res) => res.data);
  }
}
