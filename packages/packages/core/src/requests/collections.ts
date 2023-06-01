import type { KeyFilter } from "@presenciaglobal/utils";
import { Qs } from "../utils";
import type { QueryOptions, ContentSchemas } from "../types";
import pluralize from "pluralize";

export async function getCollection<
  C extends KeyFilter<Strapi.Schemas, `api::${string}`>
>(
  collection: C,
  query: QueryOptions<ContentSchemas.FlatCollection<C>> = {}
): Promise<ContentSchemas.ResponseCollection<C>> {
  const [first, rest] = (collection as string).split("::");
  const [second] = rest.split(".").map((item) => pluralize(item));
  const path = `${first}/${second}`;

  let queryString = Qs.stringify(query);
  queryString = queryString ? `?${queryString}` : "";

  const url = `${process.env.CMS_URL}/${path}${queryString}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CMS_ACCESS_TOKEN}`,
    },
  });

  return response.json();
}
