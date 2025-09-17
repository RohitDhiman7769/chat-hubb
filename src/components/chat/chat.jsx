import { useEffect, useImperativeHandle, useState, useRef, forwardRef } from "react";
import { ReportUserId, fetchParticularUserProfile } from '../../utils/chat-funtion';
import { addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { db } from "../../firebase-config";
import { addImageInS3Bucket } from "../../utils/chat-funtion";
import './chat.css';

const Chat = forwardRef(({ appendUserId, conversationId, conversationDocRef, paramToKnowComponent }, ref) => {
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


  /**
   * fetch data from firebase
   */
  const fetchChatFromFireBase = () => {
    const messagesCollectionRef = collection(conversationDocRef, conversationId);
    const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));

    // Real-time listener for messages
    try {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setShowSpinner(false)
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "auto" });
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

  /**
   * 
   * @param {*} e get seleected image and upload into S3 buckete and upload URL on firebase
   */
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
    // <>

    //   {showSpinner ? (
    //     <div className="flex justify-center items-center min-h-[200px]">
    //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    //     </div>
    //   ) : (
    //     <>
    //       <div className="flex flex-col gap-2 p-4 overflow-y-auto h-[70vh] bg-gray-50">
    //         {messages?.length > 0 ? (
    //           messages?.map((mes, index) => (
    //             <div key={mes.id}>
    //               {(formatTimestamp(messages[index - 1]?.createdAt, 1) !== formatTimestamp(mes.createdAt, 1)) && (
    //                 <p className="text-center text-xs text-gray-400 my-2">{formatTimestamp(mes.createdAt, 1)}</p>
    //               )}
    //               {mes.user == currentUserId ? (
    //                 <div className="flex justify-end items-end gap-2 mb-2">
    //                   <div className="relative">
    //                     <button className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded" type="button">
    //                       <i className="fa-solid fa-ellipsis-vertical"></i>
    //                     </button>
    //                     {/* Dropdown */}
    //                     <ul className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
    //                       <li>
    //                         <button onClick={() => deleteWallMessage(mes.id)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
    //                           <img src="assets/images/customer-contact.svg" alt="" className="w-4 h-4" />
    //                           Delete
    //                         </button>
    //                       </li>
    //                       <li>
    //                         <button onClick={() => sendUserIdForReport(mes.user)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
    //                           <img src="assets/images/delete.svg" alt="" className="w-4 h-4" />
    //                           Report user
    //                         </button>
    //                       </li>
    //                     </ul>
    //                   </div>
    //                   <div className="flex flex-col items-end" ref={bottomRef}>
    //                     {mes.type === 'file' ? (
    //                       <div className="rounded border border-gray-300 overflow-hidden mb-1">
    //                         <img src={mes.text} className="h-36 w-36 object-cover" alt="Attachment" />
    //                       </div>
    //                     ) : (
    //                       <div className="bg-blue-500 text-white px-4 py-2 rounded-lg max-w-xs break-words">{mes.text}</div>
    //                     )}
    //                     <span className="text-xs text-gray-400 mt-1">{formatTimestamp(mes.createdAt)}</span>
    //                   </div>
    //                   <img className="w-2 h-2 rounded-full border border-gray-300" src={mes.image} alt="Avatar" />
    //                 </div>
    //               ) : (
    //                 <div className="flex justify-start items-end gap-2 mb-2">
    //                   <img className="w-2 h-2 rounded-full border border-gray-300 cursor-pointer" src={mes.image} alt="Avatar" onClick={() => getUserId(mes)} />
    //                   <div className="flex flex-col items-start">
    //                     <p className="font-bold text-sm">{mes.name}</p>
    //                     {mes.type === 'file' ? (
    //                       <div className="rounded border border-gray-300 overflow-hidden mb-1">
    //                         <img src={mes.text} className="h-16 w-16 object-cover" alt="Attachment" />
    //                       </div>
    //                     ) : (
    //                       <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs break-words">{mes.text}</div>
    //                     )}
    //                     <span className="text-xs text-gray-400 mt-1">{formatTimestamp(mes.createdAt, 2)}</span>
    //                   </div>
    //                   <div className="relative">
    //                     <button className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded" type="button">
    //                       <i className="fa-solid fa-ellipsis-vertical"></i>
    //                     </button>
    //                     {/* Dropdown */}
    //                     <ul className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
    //                       <li>
    //                         <button onClick={() => sendUserIdForReport(mes.user)} className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2">
    //                           <img src="assets/images/delete.svg" alt="" className="w-4 h-4" />
    //                           Report user
    //                         </button>
    //                       </li>
    //                     </ul>
    //                   </div>
    //                 </div>
    //               )}
    //             </div>
    //           ))
    //         ) : (
    //           <div className="flex justify-center items-center h-full">
    //             <h2 className="text-lg text-gray-400">No Wall message yet!</h2>
    //           </div>
    //         )}
    //       </div>
    //       {paramToKnowComponent != 2 && (
    //         <div className="w-full bg-white border-t px-4 py-2 flex items-center gap-2">
    //           <textarea
    //             value={newMessage}
    //             onChange={(e) => setNewMessage(e.target.value)}
    //             className="flex-1 resize-none border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
    //             placeholder="Skriv meddelande..."
    //             rows="1"
    //           />
    //           <label htmlFor="file_input" className="cursor-pointer text-gray-500 hover:text-blue-500">
    //             <i className="fa-solid fa-paperclip"></i>
    //           </label>
    //           <input type="file" id="file_input" onChange={getImages} hidden multiple accept="image/*,video/*" />
    //           <button className="text-blue-500 hover:text-blue-700 text-xl" onClick={sendMessage}>
    //             <i className="fa-solid fa-paper-plane"></i>
    //           </button>
    //         </div>
    //       )}
    //     </>
    //   )}

    // </>
    <>
      {showSpinner ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          {/* <div className="chat-messages">
            {messages?.length > 0 ? (
              messages?.map((mes, index) => (
                <div key={mes.id}>
                  {formatTimestamp(messages[index - 1]?.createdAt, 1) !==
                    formatTimestamp(mes.createdAt, 1) && (
                    <p className="chat-date">{formatTimestamp(mes.createdAt, 1)}</p>
                  )}

                  {mes.user === currentUserId ? (
                    <div className="chat-message right">
                      <div className="dropdown">
                        <button className="dropdown-btn" type="button">
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              onClick={() => deleteWallMessage(mes.id)}
                              className="dropdown-item"
                            >
                              <img
                                src="assets/images/customer-contact.svg"
                                alt=""
                                className="icon"
                              />
                              Delete
                            </button>
                          </li>
                          <li>
                            <button
                              onClick={() => sendUserIdForReport(mes.user)}
                              className="dropdown-item"
                            >
                              <img
                                src="assets/images/delete.svg"
                                alt=""
                                className="icon"
                              />
                              Report user
                            </button>
                          </li>
                        </ul>
                      </div>

                      <div className="message-content" ref={bottomRef}>
                        {mes.type === "file" ? (
                          <div className="file-message">
                            <img
                              src={mes.text}
                              className="file-preview"
                              alt="Attachment"
                            />
                          </div>
                        ) : (
                          <div className="bubble blue">{mes.text}</div>
                        )}
                        <span className="timestamp">
                          {formatTimestamp(mes.createdAt)}
                        </span>
                      </div>

                      <img className="avatar" src={mes.image} alt="Avatar" />
                    </div>
                  ) : (
                    <div className="chat-message left">
                      <img
                        className="avatar"
                        src={mes.image}
                        alt="Avatar"
                        onClick={() => getUserId(mes)}
                      />
                      <div className="message-content">
                        <p className="username">{mes.name}</p>
                        {mes.type === "file" ? (
                          <div className="file-message small">
                            <img
                              src={mes.text}
                              className="file-preview small"
                              alt="Attachment"
                            />
                          </div>
                        ) : (
                          <div className="bubble gray">{mes.text}</div>
                        )}
                        <span className="timestamp">
                          {formatTimestamp(mes.createdAt, 2)}
                        </span>
                      </div>

                      <div className="dropdown">
                        <button className="dropdown-btn" type="button">
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button
                              onClick={() => sendUserIdForReport(mes.user)}
                              className="dropdown-item"
                            >
                              <img
                                src="assets/images/delete.svg"
                                alt=""
                                className="icon"
                              />
                              Report user
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-messages">
                <h2>No Wall message yet!</h2>
              </div>
            )}
          </div>

          {paramToKnowComponent !== 2 && (
            <div className="chat-input">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="input-box"
                placeholder="Skriv meddelande..."
                rows="1"
              />
              <label htmlFor="file_input" className="file-label">
                <i className="fa-solid fa-paperclip"></i>
              </label>
              <input
                type="file"
                id="file_input"
                onChange={getImages}
                hidden
                multiple
                accept="image/*,video/*"
              />
              <button className="send-btn" onClick={sendMessage}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          )} */}

          <div className="chat-messages p-3" style={{ background: "#f5f7fb", minHeight: "70vh", overflowY: "auto" }}>
            {messages?.length > 0 ? (
              messages.map((mes, index) => (
                <div key={mes.id}>
                  {/* Date Divider */}
                  {formatTimestamp(messages[index - 1]?.createdAt, 1) !== formatTimestamp(mes.createdAt, 1) && (
                    <div className="text-center my-3">
                      <span className="badge bg-light text-muted px-3 py-1 rounded-pill small">
                        {formatTimestamp(mes.createdAt, 1)}
                      </span>
                    </div>
                  )}

                  {/* Right Side (My Message) */}
                  {mes.user === currentUserId ? (
                    <div className="chat-message d-flex justify-content-end mb-3">
                      <div className="d-flex flex-column align-items-end">
                        <div className="position-relative d-flex align-items-center">
                          <div className="dropdown me-2">
                            <button className="btn btn-sm text-muted" type="button" data-bs-toggle="dropdown">
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button onClick={() => deleteWallMessage(mes.id)} className="dropdown-item">
                                  <i className="fa fa-trash me-2 text-danger"></i> Delete
                                </button>
                              </li>
                              <li>
                                <button onClick={() => sendUserIdForReport(mes.user)} className="dropdown-item">
                                  <i className="fa fa-flag me-2 text-warning"></i> Report user
                                </button>
                              </li>
                            </ul>
                          </div>

                          <div className="message-content" ref={bottomRef}>
                            {mes.type === "file" ? (
                              <div className="file-message">
                                <img src={mes.text} className="file-preview rounded" alt="Attachment" />
                              </div>
                            ) : (
                              <div className="bubble bg-primary text-white px-3 py-2 rounded-3 shadow-sm">{mes.text}</div>
                            )}
                            {/* <span className="timestamp small text-muted d-block mt-1 text-end">
                              {formatTimestamp(mes.createdAt)}
                            </span> */}
                          </div>
                        </div>
                      </div>
                      <img className="avatar ms-2 rounded-circle" src={mes.image} alt="Avatar" style={{ width: 40, height: 40 }} />
                    </div>
                  ) : (
                    /* Left Side (Other's Message) */
                    <div className="chat-message d-flex justify-content-start mb-3">
                      <img
                        className="avatar me-2 rounded-circle"
                        src={mes.image}
                        alt="Avatar"
                        style={{ width: 40, height: 40, cursor: "pointer" }}
                        onClick={() => getUserId(mes)}
                      />
                      <div className="d-flex flex-column align-items-start">
                        <p className="username mb-1 fw-bold text-primary small">{mes.name}</p>
                        {mes.type === "file" ? (
                          <div className="file-message small">
                            <img src={mes.text} className="file-preview small rounded" alt="Attachment" />
                          </div>
                        ) : (
                          <div className="bubble bg-light text-dark px-3 py-2 rounded-3 shadow-sm">{mes.text}</div>
                        )}
                        {/* <span className="timestamp small text-muted d-block mt-1">{formatTimestamp(mes.createdAt, 2)}</span> */}
                      </div>

                      <div className="dropdown ms-2">
                        <button className="btn btn-sm text-muted" type="button" data-bs-toggle="dropdown">
                          <i className="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                          <li>
                            <button onClick={() => sendUserIdForReport(mes.user)} className="dropdown-item">
                              <i className="fa fa-flag me-2 text-warning"></i> Report user
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-messages text-center my-5">
                <h5 className="text-muted">💬 No messages yet</h5>
                <p className="small text-secondary">Start the conversation by sending a message!</p>
              </div>
            )}
          </div>

          {/* Chat Input */}
          {paramToKnowComponent !== 2 && (
            <div className="chat-input d-flex align-items-center border-top bg-white p-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="form-control me-2 rounded-pill"
                placeholder="Type a message..."
                rows="1"
                style={{ resize: "none" }}
              />
              <label htmlFor="file_input" className="btn btn-light rounded-circle me-2">
                <i className="fa-solid fa-paperclip"></i>
              </label>
              <input
                type="file"
                id="file_input"
                onChange={getImages}
                hidden
                multiple
                accept="image/*,video/*"
              />
              <button className="btn btn-primary rounded-circle" onClick={sendMessage}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          )}

        </>
      )}
    </>
  );
})
export default Chat;