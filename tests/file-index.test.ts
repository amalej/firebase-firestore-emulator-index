import {
  getFirebaseJsonConfig,
  getFirestoreConfig,
  getFirestoreIndexesJsonConfig,
} from "../src/file-index";
import { FirestoreDbJsonConfig } from "../src/types";

describe("Get Firebase JSON config", () => {
  it("should correctly get config for single db setup", async () => {
    const config = await getFirebaseJsonConfig("./tests/single-db");
    expect(config.firestore).toBeDefined();

    expect((config.firestore as FirestoreDbJsonConfig).indexes).toBe(
      "firestore.indexes.json"
    );
  });

  it("should throw error if misconfigured json", async () => {
    try {
      await getFirebaseJsonConfig("./tests/misconfigured-db");
    } catch (error) {
      expect(error.message).toBe(
        "Missing `firestore` field in `firebase.json`"
      );
    }
  });
});

describe("Get Firebase Firestore Index JSON config", () => {
  it("should correctly get config for single db setup", async () => {
    const firebaseJsonConfig = await getFirebaseJsonConfig("./tests/single-db");
    const firestoreIndexesConfig = await getFirestoreIndexesJsonConfig(
      "./tests/single-db",
      firebaseJsonConfig
    );

    expect(firestoreIndexesConfig[0].indexes).toEqual([
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

  it("should correctly get database for single db setup", async () => {
    const firebaseJsonConfig = await getFirebaseJsonConfig("./tests/single-db");
    const firestoreIndexesConfig = await getFirestoreIndexesJsonConfig(
      "./tests/single-db",
      firebaseJsonConfig
    );

    expect(firestoreIndexesConfig[0].database).toBe("(default)");
  });

  it("should correctly get config for multi db setup", async () => {
    const firebaseJsonConfig = await getFirebaseJsonConfig("./tests/multi-db");
    const firestoreIndexesConfig = await getFirestoreIndexesJsonConfig(
      "./tests/multi-db",
      firebaseJsonConfig
    );

    expect(firestoreIndexesConfig[0].database).toBe("(default)");
    expect(firestoreIndexesConfig[0].indexes).toEqual([
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
    ]);
    expect(firestoreIndexesConfig[1].indexes).toEqual([]);
  });

  describe("Get Firestore JSON config", () => {
    it("should correctly get the Firebase JSON config for single db", async () => {
      const firestoreConfig = await getFirestoreConfig("./tests/single-db");

      expect(firestoreConfig[0].database).toBe("(default)");
      expect(firestoreConfig[0].indexes).toEqual([
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

    it("should correctly get the Firebase JSON config for multi db", async () => {
      const firestoreConfig = await getFirestoreConfig("./tests/multi-db");

      expect(firestoreConfig[0].database).toBe("(default)");
      expect(firestoreConfig[0].indexes).toEqual([
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
      ]);

      expect(firestoreConfig[1].database).toBe("ecommerce");
      expect(firestoreConfig[1].indexes).toEqual([]);
    });
  });
});
