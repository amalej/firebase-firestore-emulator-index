# Firebase Firestore Emulator Index

## Installation:

```
npm i -g firebase-firestore-emulator-index
```

## How to use:

### Interactive mode

In interactive mode, the CLI will periodically make a request to the Firestore Emulator to get a list of new indexes. You can invoke actions by pressing 'w' to update, 'r' to reset, 'q' to quit/exit

```
findex --project PROJECT_ID --path=PATH_TO_PROJECT_DIRECTORY --port 8080
```

```
[info] Commands: Press 'w' to update, 'r' to reset, 'q' to quit/exit
[info] Path: testing/multi-db
[info] Project ID: demo-project
[info] Databases: (default)
[info] New indexes for (default).
```

### Non-interactive mode

In non-interactive mode, the CLI will make a request to the Firestore Emulator to get a list of new indexes, then updates your indexes file.

```
findex --project PROJECT_ID --path=PATH_TO_PROJECT_DIRECTORY --non-interactive
```

```
[info] New indexes for (default), ecommerce.
[info] Updating indexes for (default), ecommerce
[success] Done updating indexes
```
