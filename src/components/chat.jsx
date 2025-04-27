import { useEffect, useImperativeHandle, useState, useRef, forwardRef } from "react";
import { ReportUserId, fetchParticularUserProfile } from '../utils/chat-funtion';
import { addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { db } from "../firebase-config";
import { addImageInS3Bucket } from "../utils/chat-funtion";
const Chat = forwardRef(({ appendUserId, conversationId, conversationDocRef,paramToKnowComponent }, ref) => {
    const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('user_id'))
    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [showSpinner, setShowSpinner] = useState(true)
    const bottomRef = useRef(null);


    useImperativeHandle(ref, () => ({
        callChatFunct: () => {
            fetchChatFromFireBase()
        },
    }));


    const fetchChatFromFireBase = () => {
        const messagesCollectionRef = collection(conversationDocRef, conversationId);
        const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));

        // Real-time listener for messages
        try{
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setShowSpinner(false)
                setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
                // bottomRef.current.scrollIntoView({ behavior: "smooth" });
            });
            return () => unsubscribe();
        }catch(err){
            console.log(err)
        }
     


    }

    useEffect(() => {
        if (bottomRef.current) {
        //   bottomRef.current.scrollIntoView({ behavior: "smooth" });
        bottomRef.current.scrollIntoView({ behavior:  "auto" });
        }
      }, [messages]);
    /**
     * sent message
     */
    const sendMessage = async () => {
        const conversationData = {
            text: newMessage,
            type: 'text',
            name: localStorage.getItem('email').split('@')[0],
            createdAt: serverTimestamp(),
            user: localStorage.getItem('user_id'),
            image: localStorage.getItem('profile_img'),
            conversationId: conversationId
        }

        const messagesCollectionRef = collection(conversationDocRef, conversationId);
        await addDoc(messagesCollectionRef, conversationData)
        setNewMessage('')
    }

    /**
     * 
     * @param {*} firebaseTimestamp get date format from firebase 
     * @returns update date format data
     */
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
    * @param {*} id get user id for report  
    */
    const sendUserIdForReport = async (id) => {
        ReportUserId(id)
    }


    /**
     * 
     * @param {*} data fetch user profile for view
     */
    const getUserId = async (data) => {
        appendUserId(data.user)
    }


    /**
    * 
    * @param {*} id get message id to delete specific user message on firebase 
    */
    const deleteWallMessage = async (id) => {
        try {
            const messageDocRef = doc(conversationDocRef, conversationId, id);
            await deleteDoc(messageDocRef);
        } catch (err) {
            console.log(err)
        }
    }

    const getImages = async (e) => {
        for (let val of e.target.files) {
            const image = await addImageInS3Bucket(val)
            const conversationData = {
                text: image,
                type: 'file',
                name: localStorage.getItem('email').split('@')[0],
                createdAt: serverTimestamp(),
                user: localStorage.getItem('user_id'),
                image: localStorage.getItem('profile_img'),
                conversationId: conversationId
            }
            console.log(conversationData)
            const messagesCollectionRef = collection(conversationDocRef, conversationId);
            await addDoc(messagesCollectionRef, conversationData)
        }
    }
    return (
        <>
            {showSpinner ?
                <>
                    <div className="d-flex justify-content-center main_spinner_box">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>

                </>
                :
                <>
  
                    <div className="chat_body " >
                        {messages?.length > 0 ? (
                            messages?.map((mes, index) => (
                                <>
                                    {(formatTimestamp(messages[index - 1]?.createdAt, 1) != formatTimestamp(mes.createdAt, 1)) && <p className="m-0 date_body">{formatTimestamp(mes.createdAt, 1)}</p>}
                                    {mes.user == currentUserId
                                        ?
                                        <div  key={mes.id} className="right_chat chat_main d-flex justify-content-end align-items-end">
                                            <a className="btn" href="javascript:void(0)" role="button" data-bs-toggle="dropdown"
                                                aria-expanded="false">
                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                            </a>
                                            <ul className="dropdown-menu">
                                                <li onClick={() => deleteWallMessage(mes.id)}>
                                                    <a className="dropdown-item" href="javascript:void(0)" data-bs-toggle="modal"
                                                        data-bs-target="#chat_support"><img src="assets/images/customer-contact.svg" alt="" />
                                                        Delete</a>
                                                </li>
                                                <li onClick={() => sendUserIdForReport(mes.user)}>
                                                    <a className="dropdown-item delete_item" href="javascript;void(0)" data-bs-toggle="modal"
                                                        data-bs-target="#delete_chat">
                                                        <img src="assets/images/delete.svg" alt="" />
                                                        Report user</a>
                                                </li>

                                            </ul>
                                            <div className="chat_inner d-flex justify-content-start align-items-center" ref={bottomRef}>
                                                {mes.type == 'file' ?
                                                    <>
                                                        <div className="image_box">
                                                            <img src={mes.text} style={{ height: '150px', width: '150px', border: '1px solid black', borderRadius: '1px !important' }} alt="Avatar" />
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        <div className="messsage">
                                                            {mes.text}
                                                        </div>
                                                    </>
                                                }

                                                <span className="time">{formatTimestamp(mes.createdAt)}</span>
                                            </div>
                                            <div className="image_box">
                                                <img style={{ border: '1px solid black', borderRadius: '100px' }} src={mes.image} alt="Avatar" />
                                            </div>
                                        </div>
                                        :
                                        <div  key={mes.id} className="left_chat chat_main d-flex justify-content-start align-items-end">
                                            <div className="image_box" style={{ cursor: 'pointer' }} onClick={() => getUserId(mes)}>
                                                <img style={{ border: '1px solid black', borderRadius: '100px' }} src={mes.image} alt="Avatar" />
                                            </div>
                                            <div className="chat_inner d-flex justify-content-start align-items-center">
                                                <div className="messsage" ref={bottomRef}>
                                                    <p style={{ fontWeight: '700' }}>
                                                        {mes.name}
                                                    </p>

                                                    {mes.type == 'file' ?
                                                        <>
                                                            <div className="image_box">
                                                                <img src={mes.text} style={{ height: '150px', width: '150px', border: '1px solid black', borderRadius: '1px' }} alt="Avatar" />
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            <div className="messsage">
                                                                {mes.text}
                                                            </div>
                                                        </>
                                                    }
                                                    <br />
                                                    <span className="time">{formatTimestamp(mes.createdAt, 2)}</span>

                                                </div>

                                            </div>
                                            <a className="btn" href="javascript:void(0)" role="button" data-bs-toggle="dropdown"
                                                aria-expanded="false">
                                                <i className="fa-solid fa-ellipsis-vertical"></i>
                                            </a>
                                            <ul className="dropdown-menu">
                                                <li onClick={() => sendUserIdForReport(mes.user)}>
                                                    <a className="dropdown-item delete_item" href="javascript;void(0)" data-bs-toggle="modal"
                                                        data-bs-target="#delete_chat">
                                                        <img src="assets/images/delete.svg" alt="" />
                                                        Report user</a>
                                                </li>

                                            </ul>
                                        </div>
                                    }
                                </>
                            ))
                        ) : (
                            <>
                                <div className="no_data" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <h2>No Wall message yet!</h2>
                                </div>
                            </>
                        )}


                    </div>




                </>

            }
            {paramToKnowComponent != 2 && 
             <div className="main_chat_send position-relative" >
             <div className="chat_send_box position-relative">
                 <div className="input_box">
                     <textarea type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="inPut_send" placeholder="Skriv meddelande..." rows="1"></textarea>
                 </div>
                 <div className="send_btns">
                     <div className="file_open">
                         <label htmlFor="file_input">
                             <i className="fa-solid fa-paperclip"></i>
                         </label>
                         <input type="file" id="file_input" onChange={(e) => getImages(e)} hidden multiple accept="image/*,video/*" />
                     </div>
                     <button className="send_chat" onClick={sendMessage}>
                         <i className="fa-solid fa-paper-plane"></i>
                     </button>
                 </div>
             </div>
         </div>
            }
           
        </>
    );
})
export default Chat;