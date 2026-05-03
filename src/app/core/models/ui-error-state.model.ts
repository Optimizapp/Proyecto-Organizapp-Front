export type FormErrorMap = Record<string, string>;

export interface UiErrorState {
  message: string;
  fields: FormErrorMap;
}
