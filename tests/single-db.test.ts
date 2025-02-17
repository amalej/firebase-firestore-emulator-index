import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getIndexesFromEmulator } from "../src/emulator-index";
import { deepEqual } from "../src/utils";

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

const firebaseApp = initializeApp({
  projectId: "demo-project",
});

const db = getFirestore(firebaseApp);

export async function query_1() {
  const collectionRef = db.collection("food");
  await collectionRef
    .where("name", "==", "eggs")
    .where("ingridients", "array-contains", "egg")
    .where("difficulty", ">=", 7)
    .get();
}

export async function query_2() {
  const collectionRef = db.collection("food");
  await collectionRef
    .where("name", "==", "eggs")
    .where("ingridients", "array-contains", "egg")
    .where("difficulty", ">=", 7)
    .orderBy("difficulty", "desc")
    .get();
}

describe("Single DB Firestore", () => {
  it("should get a response from the emulator index endpoint", async () => {
    await query_1();
    const indexes = await getIndexesFromEmulator("demo-project");
    expect(indexes).toEqual([
      {
        collectionGroup: "food",
        queryScope: "COLLECTION",
        fields: [
          {
            fieldPath: "ingridients",
            arrayConfig: "CONTAINS",
          },
          {
            fieldPath: "name",
            order: "ASCENDING",
          },
          {
            fieldPath: "difficulty",
            order: "ASCENDING",
          },
        ],
      },
    ]);
  });

  it("should get a response from the emulator index endpoint", async () => {
    await query_2();
    const indexes = await getIndexesFromEmulator("demo-project");
    expect(
      deepEqual(indexes, [
        {
          collectionGroup: "food",
          queryScope: "COLLECTION",
          fields: [
            {
              fieldPath: "ingridients",
              arrayConfig: "CONTAINS",
            },
            {
              fieldPath: "name",
              order: "ASCENDING",
            },
            {
              fieldPath: "difficulty",
              order: "ASCENDING",
            },
          ],
        },
        {
          collectionGroup: "food",
          queryScope: "COLLECTION",
          fields: [
            {
              fieldPath: "ingridients",
              arrayConfig: "CONTAINS",
            },
            {
              fieldPath: "name",
              order: "ASCENDING",
            },
            {
              fieldPath: "difficulty",
              order: "DESCENDING",
            },
          ],
        },
      ])
    ).toBe(true);
  });
});
