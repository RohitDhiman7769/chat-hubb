import { useEffect, useState } from 'react';
import './newChat.css';
import './world-chat.css';
import { addDoc, doc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase-config';
import UserProfileView from './userProfileView';
import { fetchParticularUserProfile } from '../utils/chat-funtion';
function WorldChat() {
    const messageRef = doc(db, 'chat-hubb', 'world-chat',)
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [showChatComp, setShowChatComp] = useState(true)
    const [userProfileViewData, setUserProfileViewData] = useState()


    useEffect(() => {
        const querryMessage = query(messageRef);
        const messagesCollectionRef = collection(messageRef, 'messages');
        const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        console.log("Updated Messages in State:", messages);
    }, [messages]);

    const sendMessage = async () => {
        const conversationData = {
            text: newMessage,
            name: localStorage.getItem('email').split('@')[0],
            createdAt: serverTimestamp(),
            user: localStorage.getItem('user_id'),
            image: localStorage.getItem('profile_img'),
        }

        const messagesCollectionRef = collection(messageRef, 'messages');
        await addDoc(messagesCollectionRef, conversationData)
        setNewMessage('')
    }

    const formatTimestamp = (firebaseTimestamp, val) => {
        if (!firebaseTimestamp) return "";

        const date = new Date(firebaseTimestamp.seconds * 1000);
        if (val == 1) {

            return date.toLocaleString().split(',')[0]

        }

        return date.toLocaleString().split(',')[1]
    };


      /**
         * 
         * @param {*} data fetch user profile for view
         */
        const showUserProfileComp = async (data) => {
            try {
                const response = await fetchParticularUserProfile(data.user);
                console.log(response)
                if (response.status == 200) {
                    setUserProfileViewData(response.data.data)
                    setShowChatComp(false)
                }
            } catch (err) {
                console.log(err)
            }
        }
    if (showChatComp) {
        return (
            <section className="chat_main_section">
                <div className="container-fluid">
                    <div className="container">
                        <div className="main_form">
                            <div className="row form_row">
                                <div className="col-lg-12 fom_data ">
                                    <div className="chat_container position-relative">
                                        <div className="chat_person_head d-flex justify-content-between align-items-center">
                                            <div className="person_status_box d-flex justify-content-start align-items-center">
                                                <div className="image_box">
                                                    <img src="https://rohit-dhiman-buckt.s3.eu-north-1.amazonaws.com/Untitled+(1).png" alt="" />
                                                </div>
                                                <div className="person_status">
                                                    <h4 className="m-o person_name_head">
                                                        Open World Chat
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="dropdown setting_drop three_dot seeting_btn_mobile">
                                                <a className="btn" href="javascript:void(0)" role="button" data-bs-toggle="modal"
                                                    data-bs-target="#selectTag" aria-expanded="false">

                                                    <img className="threeDOt" src="assets/images/3dot.svg" alt="" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="chat_body ">
                                            {
                                                messages.map((mes, index) => (
                                                    <>
                                                        {(formatTimestamp(messages[index - 1]?.createdAt, 1) != formatTimestamp(mes.createdAt, 1)) && <p className="m-0 date_body">{formatTimestamp(mes.createdAt, 1)}</p>}
                                                        <div onClick={() => showUserProfileComp(mes)} key={mes.id} style={{cursor:'pointer'}} className="left_chat chat_main d-flex justify-content-start align-items-end ">
                                                            <div className="image_box">
                                                                <img src={mes.image} alt="Avatar" />
                                                            </div>
                                                            <div className="chat_inner d-flex justify-content-start align-items-center">
                                                                <div className="messsage d-block">
                                                                    <p>{mes.text}</p>
                                                                <span className="time">{formatTimestamp(mes.createdAt, 2).split(',')[0]}</span>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>
                                                ))
                                            }
                                        </div>
                                        <div className="main_chat_send position-relative">
                                            <div className="chat_send_box position-relative">
                                                <div className="input_box">
                                                    <textarea type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="inPut_send" placeholder="Skriv meddelande..." rows="1"></textarea>
                                                </div>
                                                <div className="send_btns">
                                                    <div className="file_open">
                                                        <label htmlFor="file_input">
                                                            <i className="fa-solid fa-paperclip"></i>
                                                        </label>
                                                        <input type="text" id="file_input" hidden />
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
            </section>
        );
    } else {
        return (
            <>
                <UserProfileView userData={userProfileViewData} setFieldValue={setShowChatComp}></UserProfileView>
            </>
        )
    }

}

export default WorldChat;

