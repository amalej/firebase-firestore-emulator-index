#!/usr/bin/env node

import { emitKeypressEvents } from "readline";
import { getIndexesFromEmulator } from "./emulatorIndex";
import {
  getFirestoreConfig,
  resetIndexFile,
  updateIndexFile,
} from "./fileIndex";
import { IndexesConfig } from "./types";
import {
  bold,
  deepEqual,
  error,
  info,
  parseTerminalParams,
  sleep,
  success,
} from "./utils";
import QueueFunction from "./queueFunction";

emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

const queue = new QueueFunction();
const params = parseTerminalParams();
const projectDirectory = params["path"] ?? "/";
const projectId = params["project"];
const host = params["host"] ?? "127.0.0.1";
const portAddress = params["port"] ? parseInt(params["port"]) : 8080;

if (!projectId) {
  throw Error("Missing parameter 'project'");
}

async function main() {
  const firestoreConfigs = await getFirestoreConfig(projectDirectory);
  console.log(
    info(`Commands: Press 'w' to update, 'r' to reset, 'q' to quit/exit`)
  );
  console.log(info(`Path: ${bold("testing/multi-db")}`));
  console.log(info(`Project ID: ${bold("demo-project")}`));
  console.log(
    info(
      `Databases: ${bold(firestoreConfigs.map((c) => c.database).join(", "))}`
    )
  );
  let hasAnyNewIndexChanged = false;

  process.stdin.on("keypress", (_, key) => {
    if (key && key.name == "w") {
      if (queue.isEmpty) {
        const configsThatHaveUpdates = firestoreConfigs.filter(
          (config) => config.newIndexes.length !== 0
        );
        if (configsThatHaveUpdates.length === 0) {
          console.log(info(`No updates to any database indexes.`));
          return;
        }
        console.log(
          info(
            `Updating indexes for ${bold(
              configsThatHaveUpdates.map((c) => c.database).join(", ")
            )}`
          )
        );
        const updatePromises = configsThatHaveUpdates.map((config, i) => {
          return new Promise(async (resolve, _) => {
            firestoreConfigs[i].indexes = await updateIndexFile(
              config.indexesFilePath,
              config.newIndexes
            );
            firestoreConfigs[i].newIndexes = [];
            hasAnyNewIndexChanged = true;
            resolve(firestoreConfigs[i].indexes);
          });
        });
        queue.enqueue(async () => {
          await Promise.all(updatePromises);
          console.log(success(`Done updating indexes`));
        });
      } else {
        console.log(
          error("Cannot proccess command. A process is currenly running.")
        );
      }
    } else if (key && key.name == "r") {
      if (queue.isEmpty) {
        console.log(info("Reseting indexes"));
        const updatePromises = firestoreConfigs.map((config, i) => {
          return new Promise(async (resolve, _) => {
            firestoreConfigs[i].indexes = await resetIndexFile(config);
            hasAnyNewIndexChanged = true;
            resolve(firestoreConfigs[i].indexes);
          });
        });
        queue.enqueue(async () => {
          await Promise.all(updatePromises);
          console.log(success(`Done resetting indexes`));
        });
      } else {
        console.log(
          error("Cannot proccess command. A process is currenly running.")
        );
      }
    } else if (key.sequence === "\x03" || key.name == "q") {
      console.log(info(`Exit`));
      process.exit();
    }
  });

  while (true) {
    for (let i = 0; i < firestoreConfigs.length; i++) {
      const config = firestoreConfigs[i];
      const indexesFromEmulator = await getIndexesFromEmulator(
        projectId,
        host,
        portAddress,
        config.database
      );
      const newIndexes: IndexesConfig[] = [];
      for (let indexFromEmulator of indexesFromEmulator) {
        let alreadyExists = false;
        for (let existingIndex of config.indexes) {
          if (deepEqual(existingIndex, indexFromEmulator)) {
            alreadyExists = true;
            break;
          }
        }

        if (!alreadyExists) {
          newIndexes.push(indexFromEmulator);
        }
      }

      if (newIndexes.length > 0 && !deepEqual(newIndexes, config.newIndexes)) {
        firestoreConfigs[i].newIndexes = newIndexes;
        hasAnyNewIndexChanged = true;
      }
    }

    const dbWithNewIndexes = firestoreConfigs.filter(
      (config) => config.newIndexes.length !== 0
    );
    if (hasAnyNewIndexChanged && dbWithNewIndexes.length > 0) {
      console.log(
        info(
          `New indexes for ${bold(
            dbWithNewIndexes.map((c) => c.database).join(", ")
          )}.`
        )
      );
      hasAnyNewIndexChanged = false;
    }

    await sleep(1000);
  }
}

main();
