import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/app/firebase";

export async function GET() {
  const session = await getServerSession(options);

  if (!session) {
    console.log('Nothing in session');
    return new Response('Forbidden', {
      status: 403,
    })
  }

  const firestoreSchedules = []
  const q = query(collection(db, "schedules"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    firestoreSchedules.push({ id: doc.id, ...doc.data(), date: doc.data().date.toDate() })
  });



  return Response.json(firestoreSchedules, {
    status: 200,
  })
}