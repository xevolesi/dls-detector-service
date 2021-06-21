import { ApiError } from '../../types';

function isApiError(error: ApiError | Error): error is ApiError {
  return Boolean((error as ApiError).response);
}

export function extractErrorMessage(error: ApiError | Error) {
  let message: string | undefined;

  if (isApiError(error)) {
    message = error.response?.data.detail;
  } else {
    message = error.message;
  }

  return message || 'Something went wrong';
}
