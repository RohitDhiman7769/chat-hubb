import { auth, provider } from "../firebase-config"
import { signInWithPopup } from "firebase/auth";

function GoogleAuth() {

    const style = {
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: '9px',
        height: '51px',
        color: '#6e7d8a',
        transition: 'all .5s ease',
        marginTop: '12px',
        border: '1px solid #6e7d8a',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '13px',
      };
      
    const signInWithGoogle = async () => {
        const result =  await signInWithPopup(auth, provider)
      }
    return (
        <>
            <div>
                <button  style={style} className="google_btn" onClick={signInWithGoogle}><img style={{height: '25px'}} src="src/assets/search.png" alt="" /> Continue in with google</button>
            </div>
        </>
    )
}

export default GoogleAuth;