import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/options";
import { db } from "@/app/firebase";
import { addDoc, collection} from "firebase/firestore";


export async function POST(request) {
  const session = await getServerSession(options);

  if (!session) {
    console.log('Nothing in session');
    return new Response('Forbidden', {
      status: 403,
    })
  }

  try{
    const body = await request.json()
  
    await addDoc(collection(db, "schedules"), {
      ...body, doctorId: session.user.id, date: new Date(body.date)
    });
  
    return Response.json({message:'Successfully added the schedule!'}, {
      status: 200,
    })
  }catch(err){
    return Response.json(err, {
      status: 500,
    })
  }
}