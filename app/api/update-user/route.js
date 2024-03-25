import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { db } from "@/app/firebase";
import { doc, setDoc } from "firebase/firestore";


export async function POST(request) {
  const session = await getServerSession(options);

  if (!session) {
    console.log('Nothing in session');
    return new Response('Forbidden', {
      status: 403,
    })
  }

  if (session.user.role !== 'admin') {
    console.log('Nothing in session');
    return new Response('Forbidden', {
      status: 403,
    })
  }

  try {
    const body = await request.json()

    await setDoc(doc(db, "users", body.id), {
      ...body
    })

    return Response.json({ message: 'Successfully updated the user!' }, {
      status: 200,
    })
  } catch (err) {
    console.log(err)
    return Response.json(err, {
      status: 500,
    })
  }
}