import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/app/firebase";

export async function GET() {
  const session = await getServerSession(options);

  if (!session) {
    console.log('Nothing in session');
    return new Response('Forbidden', {
      status: 403,
    })
  }

  const schedules = []
  const q = query(collection(db, "schedules"), where("patientId", "==", session.user.id));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    schedules.push({ id: doc.id, type: doc.data().type, description: doc.data().description, date: doc.data().date.toDate() })
  });

  return Response.json(schedules, {
    status: 200,
  })
}