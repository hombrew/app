import qs from "qs";
import type { KeyFilter } from "@presenciaglobal/utils";
import type { QueryOptions, ContentSchemas } from "../../types";

class QueryString {
  private static instance: QueryString;

  private constructor() {}

  /**
   * The static method that controls the access to the QueryString instance.
   *
   * This implementation let you subclass the QueryString class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): QueryString {
    if (!QueryString.instance) QueryString.instance = new QueryString();
    return QueryString.instance;
  }

  /**
   * Takes in a object representing the options you'd like
   * to represent inside the string.
   *
   * @param query The query object that shall be stringified.
   * @param options Options passed to `qs`.
   */
  stringify<T extends KeyFilter<Strapi.Schemas, `api::${string}`>>(
    query: QueryOptions<ContentSchemas.FlatCollection<T>>,
    options?: qs.IStringifyOptions
  ): string {
    return qs.stringify(query, { encodeValuesOnly: true, ...options });
  }

  /**
   * Takes in a string generated by stencil and reverts it to
   * an object.
   *
   * @param query The query string that shall be parsed.
   * @param options Options passed to `qs`.
   */
  parse<T extends KeyFilter<Strapi.Schemas, `api::${string}`>>(
    query: string,
    options?: qs.IParseOptions
  ): QueryOptions<ContentSchemas.FlatCollection<T>> {
    return qs.parse(query, options);
  }
}

export const Qs = QueryString.getInstance();
