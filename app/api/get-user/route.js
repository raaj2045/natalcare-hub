import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";


export async function GET() {
  const session = await getServerSession(options);

  if (!session) {
    console.log('Nothing in session');
    return new Response('Forbidden', {
      status: 403,
    })
  }

  const docRef = doc(db, "users", session.user.id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return Response.json({...docSnap.data(), id: docSnap.id}, {
      status: 200,
    })
  } else {
    // docSnap.data() will be undefined in this case
 
    return Response.json(['No such document!'], {
      status: 200,
    })
  }



}