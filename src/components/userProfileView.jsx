import myImage from '../assets/back.png';
import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { db } from '../firebase-config';
// import firebase from 'firebase/compat/app';

function UserProfileView({ userData ,setFieldValue}) {
    // const firestore = firebase.firestore()
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [checkData, setNewDate] = useState()
    const conversationId = [userData._id ? userData._id : userData.id].sort().join('_')


    useEffect(() => {

        if (!conversationId) return;
        // Reference to messages in the conversation subcollection
        const conversationDocRef = doc(db, "chat-hubb", "wall");
        const messagesCollectionRef = collection(conversationDocRef, conversationId);

        // Query messages ordered by timestamp (oldest to newest)
        const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));

        // Real-time listener for messages
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe(); // Cleanup on unmount
    }, [conversationId]);

    useEffect(() => {
    }, [messages]);

    const sendMessage = async () => {
        const conversationData = {
            text: newMessage,
            name: localStorage.getItem('email').split('@')[0],
            createdAt: serverTimestamp(),
            user: localStorage.getItem('user_id'),
            image: localStorage.getItem('profile_img'),
            conversationId: conversationId
        }
        const conversationDocRef = doc(db, "chat-hubb", "wall")
        const messagesCollectionRef = collection(conversationDocRef, conversationId);
        await addDoc(messagesCollectionRef, conversationData)

        setNewMessage('')
    }



    const formatTimestamp = (firebaseTimestamp, val) => {
        if (!firebaseTimestamp) return "";
        const date = new Date(firebaseTimestamp.seconds * 1000); // Convert seconds to milliseconds
        console.log(val)
        if (val == 1) {
            console.log(checkData)
            console.log(date.toLocaleString().split(",")[0])

            if (checkData == date.toLocaleString().split(",")[0]) {
                console.log(checkData)

                return 'checkData'
            } else {
                console.log('checkData')
                setNewDate(date.toLocaleString().split(",")[0])
                return checkData
            }
        } else {
            return date.toLocaleString(); // Returns "MM/DD/YYYY, HH:MM:SS AM/PM"

        }
    };

    const goBack = () =>{

        setFieldValue(true)
    }

    return (
        <>
            <section className="chat_main_section">
                <div className="container-fluid">
                    <div className="container">
                        <div className="main_form">
                            <div className="row form_row">
                                <div className="col-lg-12 fom_data ">
                                    <div className="chat_container position-relative">
                                        <div className="chat_person_head d-flex justify-content-between align-items-center">
                                            <div className="person_status_box d-flex justify-content-start align-items-center">

                                                <div className="person_status">
                                                    <h2 className="m-o person_name_head" onClick={goBack}>
                                                        <img style={{ height: '25px' }} src={myImage} alt="" />
                                                    </h2>
                                                    <h2 style={{ fontWeight: '700', paddingLeft: '15px' }} className="m-o person_name_head">
                                                        Profile
                                                    </h2>
                                                    <br />
                                                    <h4 style={{ paddingLeft: '20px' }} className="m-o person_name_head">
                                                        {userData?.email}
                                                    </h4>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="chat_body ">

                                            <div style={{ borderBottom: '1px solid lightGrey' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div style={{ marginTop: '20px' }}>
                                                        <img
                                                            className="profile-img"
                                                            src={userData?.profile_img}
                                                            alt="Profile"
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover',
                                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <h1 style={{ margin: '20px' }}>{userData?.email.split('@')[0]}</h1>
                                                </div>
                                            </div>
                                            <h2>Wall : </h2>
                                            <div className="chat_body " style={{ overflow: 'hidden' }}>
                                                {messages.length > 0 ? (

                                                    messages.map((mes) => (
                                                        <>
                                                            {/* <div> {formatTimestamp(mes.createdAt, 1)} </div> */}
                                                            <div key={mes.id} className="left_chat chat_main d-flex justify-content-start align-items-end">
                                                                <div className="image_box">
                                                                    <img src={mes.image} alt="Avatar" />
                                                                </div>
                                                                <div className="chat_inner d-flex justify-content-start align-items-center">
                                                                    <div className="messsage">{mes.text}
                                                                        <br />
                                                                        <span className="time">{formatTimestamp(mes.createdAt, 2)}</span>

                                                                    </div>

                                                                </div>
                                                            </div>
                                                        </>

                                                    ))

                                                ) : (
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>

                                                        <h2>No Wall message yet!</h2>
                                                    </div>

                                                )}
                                            </div>

                                            <div className="main_chat_send position-relative">
                                                <div className="chat_send_box position-relative">
                                                    <div className="input_box">
                                                        <textarea type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="inPut_send" placeholder="Skriv meddelande..." rows="1"></textarea>
                                                    </div>
                                                    <div className="send_btns">
                                                        <div className="file_open">
                                                            <label htmlFor="file_input">
                                                                {/* <img src="assets/images/clip.svg" alt="" /> */}
                                                                <i className="fa-solid fa-paperclip"></i>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="file_input"

                                                                hidden
                                                            />
                                                        </div>
                                                        <button className="send_chat" onClick={sendMessage}>
                                                            <i className="fa-solid fa-paper-plane"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default UserProfileView