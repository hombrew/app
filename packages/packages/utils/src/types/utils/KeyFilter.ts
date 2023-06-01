export type KeyFilter<O, F> = {
  [K in keyof O]: K extends F ? K : never;
}[keyof O];
