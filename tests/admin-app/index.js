import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore"

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";

const firebaseApp = initializeApp({
    projectId: "demo-project",
});

const db = getFirestore(firebaseApp, "ecommerce");

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

query_1()