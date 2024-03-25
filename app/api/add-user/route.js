import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { auth, db } from "@/app/firebase";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";


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

    const userCredentials = await createUserWithEmailAndPassword(auth, body.email, body.password);

    await setDoc(doc(db, "users", userCredentials.user.uid), {
      email: body.email,
      role: body.role
    });

    return Response.json({ message: 'Successfully added the user!' }, {
      status: 200,
    })
  } catch (err) {
    console.log(err)
    return Response.json(err, {
      status: 500,
    })
  }
}