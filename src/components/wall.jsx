import { addDoc, collection, onSnapshot, deleteDoc, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { ReportUserId , fetchParticularUserProfile} from '../utils/chat-funtion';
import { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import UserProfileView from './userProfileView';
import apiService from '../apiService';
import './wall.css';
import Chat from './chat';
function Wall() {
    const [messages, setMessages] = useState([])
    const conversationId = [localStorage.getItem('user_id')].sort().join('_')
    const [isShowUserProfileComponent, setShowUserProfileComponent] = useState(true)
    const [userProfileViewData, setUserProfileViewData] = useState()
    const conversationDocRef = doc(db, "chat-hubb", "wall");
    const messagesCollectionRef = collection(conversationDocRef, conversationId);


    useEffect(() => {
        console.log(conversationId)
        if (!conversationId) return;
        const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [conversationId]);

    useEffect(() => {
        console.log("Updated Messages in State:", messages);
    }, [messages]);

    /**
     * 
     * @param {*} data fetch user profile for view
     */
    const showUserProfileComp = async (data) => {
        console.log(data)
        try {
            const response = fetchParticularUserProfile(data);
            console.log(response)
            if (response.status == 200) {
                setUserProfileViewData(response.data.data)
                setShowUserProfileComponent(false)
            }
        } catch (err) {
            console.log(err)
        }
    }

    // /**
    //  * 
    //  * @param {*} firebaseTimestamp get date format from firebase 
    //  * @returns update date format data
    //  */
    // const formatTimestamp = (firebaseTimestamp, val) => {
    //     if (!firebaseTimestamp) return "";

    //     const date = new Date(firebaseTimestamp.seconds * 1000);

    //     if (val == 1) {

    //         return date.toLocaleString().split(',')[0]

    //     }

    //     return date.toLocaleString().split(',')[1]
    // };

    // /**
    //  * 
    //  * @param {*} id get user id for report  
    //  */
    // const sendUserIdForReport = async (id) => {
    //     ReportUserId(id)
    // }

    // /**
    //  * 
    //  * @param {*} id get message id to delete specific user message on firebase 
    //  */
    // const deleteWallMessage = async (id) => {
    //     console.log(id)
    //     try {
    //         const messageDocRef = doc(conversationDocRef, conversationId, id);
    //         await deleteDoc(messageDocRef);
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

    if (isShowUserProfileComponent) {

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
                                                <div className="person_status">
                                                    <h4 className="m-o person_name_head">
                                                        Wall
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

                                        <Chat messagesList={messages} appendUserId={(e)=>showUserProfileComp(e)}></Chat>


                                            {/* {messages.length > 0 ? (
                                                messages.map((mes, index) => (
                                                    <>
                                                        {(formatTimestamp( messages[index - 1]?.createdAt, 1) != formatTimestamp(mes.createdAt, 1)) && <p className="m-0 date_body">{formatTimestamp(mes.createdAt, 1)}</p>}
                                                        <div key={mes.id} className="left_chat chat_main d-flex justify-content-start align-items-end">
                                                            <div className="image_box" style={{ cursor: 'pointer' }} onClick={() => showUserProfileComp(mes)}>
                                                                <img src={mes.image} alt="Avatar" />
                                                            </div>
                                                            <div className="chat_inner d-flex justify-content-start align-items-center">
                                                                <div className="messsage">
                                                                    <p style={{ fontWeight: '700' }}>
                                                                        {mes.name}
                                                                    </p>

                                                                    {mes.text}
                                                                    <br />
                                                                    <span className="time">{formatTimestamp(mes.createdAt, 2)}</span>

                                                                </div>

                                                            </div>
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
                                                        </div>
                                                    </>
                                                ))
                                            ) : (
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>

                                                    <h2>No Wall message yet!</h2>
                                                </div>

                                            )} */}
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
            <UserProfileView userData={userProfileViewData}></UserProfileView>
        )
    }

}
export default Wall;
