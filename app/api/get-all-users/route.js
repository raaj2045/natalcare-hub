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

  const patients = []
  const q = query(collection(db, "users"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    patients.push({ id: doc.id, ...doc.data() })
  });

  return Response.json(patients, {
    status: 200,
  })
}