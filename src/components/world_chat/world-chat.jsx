import { useEffect, useState, useRef } from 'react';
import './newChat.css';
import './world-chat.css';
import { addDoc, doc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase-config';
import UserProfileView from '../user_profile/userProfileView';
import { fetchParticularUserProfile } from '../../utils/chat-funtion';
// import Chat from '../../../src/components/chat';
import Chat from '../chat/chat';

function WorldChat() {
    const ChatComponent = useRef()

    const conversationDocRef = doc(db, 'chat-hubb', 'world-chat',)
    const conversationId = ( 'messages');
    const [showChatComp, setShowChatComp] = useState(true)
    const [chatComp, setShowChat] = useState(false)
    const [userProfileViewData, setUserProfileViewData] = useState()

    useEffect(() => {
        if (ChatComponent.current) {
            ChatComponent.current.callChatFunct()
        }
    }, [chatComp])


    /**
       * 
       * @param {*} data fetch user profile for view
       */
    const showUserProfileComp = async (data) => {
        console.log(data)
        try {
            const response = await fetchParticularUserProfile(data);
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
                                        <Chat conversationDocRef={conversationDocRef} conversationId={conversationId} ref={ChatComponent} appendUserId={(e) => showUserProfileComp(e)} ></Chat>
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

