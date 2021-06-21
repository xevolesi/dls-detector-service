import { AxiosError } from 'axios';

export type ApiError = AxiosError<{ detail?: string }>;

export type TBox = {
  color: [red: number, green: number, blue: number];
  class_name: string;
  confidence: number;
  coordinates: [left: number, top: number, width: number, height: number];
};
