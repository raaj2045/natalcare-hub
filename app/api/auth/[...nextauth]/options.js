import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from "@/app/firebase";
import { doc, getDoc } from "firebase/firestore";


export const options = {
    providers: [
        CredentialsProvider({
            credentials: {
                username: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {

                try {
                    const userCredentials = await signInWithEmailAndPassword(auth, credentials.username || '', credentials.password || '');

                    if (userCredentials.user) {
                        // Return the user object if sign-in is successful
                        const docRef = doc(db, "users", userCredentials.user.uid);
                        const docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {

                            const user = { ...docSnap.data(), id: userCredentials.user.uid }
                            console.log("user data:", user);
                            return user;

                        } else {
                            // docSnap.data() will be undefined in this case
                            throw new Error("No user found.")
                        }
                    } else {
                        // Return false if sign-in fails
                        throw new Error("Login failed, try again later.")
                    }
                } catch (error) {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(errorCode, errorMessage)
                    throw new Error(errorMessage)
                }
            }
        })

    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.id = user.id
            }
            return token;
        },
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role
                session.user.id = token.id
            }
            return session;
        },
    },
};