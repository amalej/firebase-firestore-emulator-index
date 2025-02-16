export interface FirebaseJsonConfig {
  firestore: FirestoreDbJsonConfig | FirestoreDbJsonConfig[];
}

export interface FirestoreDbJsonConfig {
  database?: string;
  //   rules: string;
  indexes: string;
}

export interface FirestoreConfig {
  database: string;
  //   rules: string;
  indexes: IndexesConfig[];
  indexesFilePath: string;
  originalIndexes: IndexesConfig[];
  newIndexes: IndexesConfig[];
}

export interface IndexesConfig {
  collectionGroup: string;
  queryScope: string;
  fields: Array<
    | {
        fieldPath: string;
        arrayConfig: string;
      }
    | {
        fieldPath: string;
        order: string;
      }
  >;
}

export interface IndexesFetchResponse {
  reports: Array<{
    index: {
      name: string;
      queryScope: string;
      fields: Array<
        | {
            fieldPath: string;
            arrayConfig: string;
          }
        | {
            fieldPath: string;
            order: string;
          }
      >;
      numQueries: number;
    };
  }>;
}

// export interface IndexFileFormat {
//   collectionGroup: string;
//   queryScope: string;
//   fields: Array<
//     | {
//         fieldPath: string;
//         arrayConfig: string;
//       }
//     | {
//         fieldPath: string;
//         order: string;
//       }
//   >;
// }

// interface FirebaseConfig {
//   firestore?: FirestoreDbConfig | FirestoreDbConfig[];
// }
