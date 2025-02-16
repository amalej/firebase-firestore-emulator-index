import { IndexesConfig, IndexesFetchResponse } from "./types";

export async function getIndexesFromEmulator(
  projectId: string,
  host: string = "127.0.0.1",
  port: number = 8080,
  databaseName: string
) {
  const res = await fetch(
    `http://${host}:${port}/emulator/v1/projects/${projectId}:indexUsage?database=projects/${projectId}/databases/${databaseName}`
  );

  const text = await res.text();
  const rawResponse = JSON.parse(text) as IndexesFetchResponse;

  const indexes: IndexesConfig[] = [];
  const indexReports = rawResponse.reports || [];
  for (let { index } of indexReports) {
    const regex =
      /projects\/[^\/]+\/databases\/[^\/]+\/collectionGroups\/([^\/]+)\/indexes\/_/i;
    const matches = index.name.match(regex);
    if (!matches && !matches[1]) {
      throw Error("Unexpected Error: no matched string for collectionGroup");
    }
    const collectionGroup = matches[1];
    indexes.push({
      collectionGroup,
      fields: index.fields.filter((fields) => fields.fieldPath !== "__name__"),
      queryScope: index.queryScope,
    });
  }

  return indexes;
}
