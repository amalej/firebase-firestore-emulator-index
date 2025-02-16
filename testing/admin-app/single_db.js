export class SingleDb {
    static query_1 = async () => {
        console.log("Query 1");
        const collectionRef = db.collection("food")
        await collectionRef
            .where("name", "==", " ")
            .where("ingridients", "array-contains", "egg")
            .where("difficulty", ">=", 7).get()
    }

    static query_2 = async () => {
        console.log("Query 2");
        const collectionRef = db.collection("food")
        await collectionRef
            .where("name", "==", " ")
            .where("ingridients", "array-contains", "egg")
            .where("difficulty", "<=", 7)
            .orderBy("difficulty", "desc").get()
    }
}