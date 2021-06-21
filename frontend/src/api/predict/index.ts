import { createApiInstance } from '../create-api-instance';

import { PredictApi } from './PredictApi';

export const predict = new PredictApi(createApiInstance());
