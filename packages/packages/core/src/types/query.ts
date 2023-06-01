import type { DeepRequired, KeysMatchingValue } from "@presenciaglobal/utils";

export type PagePagination = {
  page?: number;
  pageSize?: number;
};

export type OffsetPagination = {
  limit?: number;
  start?: number;
};

export type FilterOperator<T> = {
  /**
   * Description: Equal (case-sensitive)
   */
  $eq?: T;
  /**
   * Description: Equal
   */
  $eqi?: T;
  /**
   * Description: Not equal
   */
  $ne?: T;
  /**
   * Description: Less than
   */
  $lt?: number | string;
  /**
   * Description: Less than or equal to
   */
  $lte?: number | string;
  /**
   * Description: Greater than
   */
  $gt?: number | string;
  /**
   * Description: Greater than or equal to
   */
  $gte?: number | string;
  /**
   * Description: Included in an array
   */
  $in?: Array<T>;
  /**
   * Description: Not included in an array
   */
  $notIn?: Array<T>;
  /**
   * Description: Contains (case-sensitive)
   */
  $contains?: T;
  /**
   * Description: Does not contain (case-sensitive)
   */
  $notContains?: T;
  /**
   * Description: Contains
   */
  $containsi?: T;
  /**
   * Description: Does not contain
   */
  $notContainsi?: T;
  /**
   * Description: Is null
   */
  $null?: boolean;
  /**
   * Description: Is not null
   */
  $notNull?: boolean;
  /**
   * Description: Is between
   */
  $between?: [T, T];
  /**
   * Description: Starts with
   */
  $startsWith?: string;
  /**
   * Description: Ends with
   */
  $endsWith?: string;
};

export type ArrayFilterOperator<T> = {
  /**
   * Description: Joins the filters in an "or" expression
   */
  $or?: Array<Filter<T>>;
  /**
   * Description: Joins the filters in an "and" expression
   */
  $and?: Array<Filter<T>>;
};

export type Filter<T> =
  | {
      [K in keyof T]?: T[K] extends object
        ? Filter<T[K]>
        : T[K] extends unknown[]
        ? Filter<T[K][number]>
        : FilterOperator<T[K]>;
    }
  | ArrayFilterOperator<T>;

type GetKeys<T> = T extends Record<string, unknown> ? keyof T : string;
type GetSortingKeys<T extends Record<string, unknown>> =
  | `${GetKeys<T>}:${"asc" | "desc"}`
  | GetKeys<T>;
type SortingKeyFilter<T extends object> = Record<
  KeysMatchingValue<Required<T>, string | number | boolean>,
  unknown
>;

export type QueryOptions<T extends Record<string, any>> = {
  /**
   * Sort the response
   *
   * [Reference](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/sort-pagination.html#sorting)
   */
  sort?:
    | GetSortingKeys<SortingKeyFilter<T>>
    | GetSortingKeys<SortingKeyFilter<T>>[];
  /**
   * Select only specific fields to display
   *
   * [Reference](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#field-selection)
   */
  fields?: Array<keyof T> | Array<string>;
  /**
   * Filter the response
   *
   * [Reference](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/filtering-locale-publication.html#filtering)
   */
  filters?: Filter<DeepRequired<T>>;
  /**
   * Select the Draft & Publish state
   *
   * Only accepts the following values:
   *
   * - `live`
   * - `preview`
   *
   * [Reference](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/filtering-locale-publication.html#publication-state)
   */
  publicationState?: "preview" | "live";
  /**
   * Page through entries
   *
   * [Reference](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/sort-pagination.html#pagination)
   */
  pagination?: PagePagination | OffsetPagination;
  /**
   * String or Object	Populate relations, components, or dynamic zones
   *
   * [Reference](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/populating-fields.html#population)
   */
  // populate?: Array<keyof T> | PopulationMap<T> | Array<string>;
  /**
   * Select one ore multiple locales
   *
   * [Reference](https://docs.strapi.io/developer-docs/latest/developer-resources/database-apis-reference/rest/filtering-locale-publication.html#locale)
   */
  locale?: Array<string> | string;
};
