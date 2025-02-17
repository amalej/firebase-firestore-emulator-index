import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import {
  FirebaseJsonConfig,
  FirestoreConfig,
  FirestoreDbJsonConfig,
  IndexesConfig,
} from "./types";

export async function getFirebaseJsonConfig(
  projectPath: string
): Promise<FirebaseJsonConfig> {
  const fileContents = await readFile(join(projectPath, "firebase.json"), {
    encoding: "utf-8",
  });
  const config = JSON.parse(fileContents) as FirebaseJsonConfig;
  if (config.firestore === undefined) {
    throw new Error("Missing `firestore` field in `firebase.json`");
  }

  return config;
}

export async function getFirestoreIndexesJsonConfig(
  projectPath: string,
  firebaseJsonConfig: FirebaseJsonConfig
): Promise<FirestoreConfig[]> {
  const firestoreJsonConfig = firebaseJsonConfig.firestore;
  if (!Array.isArray(firestoreJsonConfig)) {
    const config = firestoreJsonConfig as FirestoreDbJsonConfig;
    const indexesFileContents = await readFile(
      join(projectPath, config.indexes),
      {
        encoding: "utf-8",
      }
    );
    const originalIndexes = JSON.parse(indexesFileContents).indexes;
    return [
      {
        indexes: originalIndexes,
        database: config.database ?? "(default)",
        indexesFilePath: join(process.cwd(), projectPath, config.indexes),
        originalIndexes,
        newIndexes: [],
      },
    ];
  } else {
    const firestoreConfig: FirestoreConfig[] = [];
    for (let config of firestoreJsonConfig) {
      const indexesFileContents = await readFile(
        join(projectPath, config.indexes),
        {
          encoding: "utf-8",
        }
      );
      const originalIndexes = JSON.parse(indexesFileContents).indexes;
      firestoreConfig.push({
        indexes: originalIndexes,
        database: config.database ?? "(default)",
        indexesFilePath: join(process.cwd(), projectPath, config.indexes),
        originalIndexes,
        newIndexes: [],
      });
    }

    return firestoreConfig;
  }
}

export async function getFirestoreConfig(
  projectPath: string
): Promise<FirestoreConfig[]> {
  const firebaseJsonConfig = await getFirebaseJsonConfig(projectPath);
  const firestoreIndexesConfig = await getFirestoreIndexesJsonConfig(
    projectPath,
    firebaseJsonConfig
  );

  return firestoreIndexesConfig;
}

export async function updateIndexFile(
  indexFilePath: string,
  newIndexes: IndexesConfig[]
): Promise<IndexesConfig[]> {
  const fileContents = await readFile(indexFilePath, {
    encoding: "utf-8",
  });
  const indexFileConfig = JSON.parse(fileContents);
  for (let newIndex of newIndexes) {
    indexFileConfig.indexes.push(newIndex);
  }

  await writeFile(indexFilePath, JSON.stringify(indexFileConfig, null, 2));
  return indexFileConfig.indexes;
}

export async function resetIndexFile(
  firestoreConfig: FirestoreConfig
): Promise<IndexesConfig[]> {
  const fileContents = await readFile(firestoreConfig.indexesFilePath, {
    encoding: "utf-8",
  });
  const indexFileConfig = JSON.parse(fileContents);
  indexFileConfig.indexes = firestoreConfig.originalIndexes;
  await writeFile(
    firestoreConfig.indexesFilePath,
    JSON.stringify(indexFileConfig, null, 2)
  );
  return firestoreConfig.originalIndexes;
}
