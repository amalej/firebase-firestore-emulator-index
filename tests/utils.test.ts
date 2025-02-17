import { bold, deepEqual, green, red, sleep, yellow } from "../src/utils";

describe("Sleep", () => {
  it("should sleep for the correct amount of time", async () => {
    const start = new Date();
    await sleep(2000);
    const end = new Date();
    expect(end.getTime() - start.getTime()).toBeCloseTo(2000, -5);
  });
});

describe("Deep equal", () => {
  it("should be able to determine if 2 object have the same values", async () => {
    const obj_1 = [
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
    ];
    const obj_2 = [
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
    ];

    expect(deepEqual(obj_1, obj_2)).toBe(true);
  });

  it("should be able to determine if 2 object are different", async () => {
    // swapped obj_2[0] and obj_2[0] so obj_1[0] != obj_2[0]
    const obj_1 = [
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
    ];
    const obj_2 = [
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
    ];

    expect(deepEqual(obj_1, obj_2)).toBe(false);
  });
});

describe("Console font", () => {
  it("should be green", () => {
    expect(green("hello world")).toBe(`\x1b[32mhello world\x1b[0m`);
  });

  it("should be red", () => {
    expect(red("hello world")).toBe(`\x1b[31mhello world\x1b[0m`);
  });

  it("should be yellow", () => {
    expect(yellow("hello world")).toBe(`\x1b[33mhello world\x1b[0m`);
  });

  it("should be bold", () => {
    expect(bold("hello world")).toBe(`\x1b[1mhello world\x1b[0m`);
  });
});
