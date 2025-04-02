import { auth, provider } from "../firebase-config"
import { signInWithPopup } from "firebase/auth";

function GoogleAuth() {
    const signInWithGoogle = async () => {
        const result =  await signInWithPopup(auth, provider)
      }
    return (
        <>
            <div>
                <button onClick={signInWithGoogle}>Continue in with google</button>
            </div>
        </>
    )
}

export default GoogleAuth;