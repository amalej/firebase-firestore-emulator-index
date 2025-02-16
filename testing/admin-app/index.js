import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080"

const firebaseApp = initializeApp({
    projectId: "demo-project"
})

const db = getFirestore(firebaseApp)

async function query_1() {
    console.log("Query 1");
    const collectionRef = db.collection("food")
    await collectionRef
        .where("test", "==", " ")
        .where("ingridients", "array-contains", "egg")
        .where("difficulty", ">=", 7).get()
}

async function query_2() {
    console.log("Query 2");
    const collectionRef = db.collection("food")
    await collectionRef
        .where("test", "==", " ")
        .where("ingridients", "array-contains", "egg")
        .where("difficulty", "<=", 7)
        .orderBy("difficulty", "desc").get()
}


async function query_3() {
    console.log("Query 2");
    const collectionRef = db.collection("food")
    await collectionRef
        .where("testing", "==", " ")
        .where("ingridients", "array-contains", "egg")
        .where("difficulty", "<=", 7)
        .orderBy("difficulty", "desc").get()
}

query_3()