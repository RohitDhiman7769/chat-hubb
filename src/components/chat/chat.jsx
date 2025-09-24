import { useEffect, useImperativeHandle, useState, useRef, forwardRef } from "react";
import { ReportUserId, fetchParticularUserProfile, addImageInS3Bucket } from '../../utils/chat-funtion';
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  orderBy,
  doc,
  deleteDoc,
  runTransaction
} from 'firebase/firestore';
import { db } from "../../firebase-config";
import './chat.css';
import { useSnackbar } from "notistack";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "👏"];

const Chat = forwardRef(({ appendUserId, conversationId, conversationDocRef, paramToKnowComponent }, ref) => {
  const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('user_id'))
  const [newMessage, setNewMessage] = useState("")
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [messages, setMessages] = useState([])
  const [showSpinner, setShowSpinner] = useState(true)
  const bottomRef = useRef(null);
  const { enqueueSnackbar } = useSnackbar();

  useImperativeHandle(ref, () => ({
    callChatFunct: () => {
      console.log('working')
      fetchChatFromFireBase()
    },
  }));


  /**
   * fetch data from firebase
   */
  const fetchChatFromFireBase = () => {
    // console.log(conversationDocRef, conversationId)
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
  const sendUserIdForReport = async (reportedId) => {
    const reportedById = localStorage.getItem('user_id')
    const data = {
      reportedTo: reportedId,
      reportedBy: reportedById
    }
    const response = await ReportUserId(data)
    console.log(response)
    if (response?.data?.code == 200) {
      enqueueSnackbar(response.data.message, { variant: "success" });
      // <Toast message={"User reported successfully"} type={"success"} / >
      // setShowToast(true)
    } else {
      console.log('working')
      enqueueSnackbar(response.response.data.message, { variant: "warning" });

    }
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

  /**
   * toggle emoji reaction
   */
  const toggleReaction = async (msgId, emoji) => {
    const uid = currentUserId;
    const msgRef = doc(conversationDocRef, conversationId, msgId);

    try {
      await runTransaction(db, async (tx) => {
        const snap = await tx.get(msgRef);
        if (!snap.exists()) return;
        const data = snap.data();
        const reactions = data.reactions || {};
        const newReactions = JSON.parse(JSON.stringify(reactions));

        if (!newReactions[emoji]) newReactions[emoji] = { count: 0, users: {} };
        const users = newReactions[emoji].users || {};

        if (users[uid]) {
          // remove reaction
          delete users[uid];
          newReactions[emoji].count = Math.max(0, (newReactions[emoji].count || 1) - 1);
          if (Object.keys(users).length === 0) {
            delete newReactions[emoji];
          } else {
            newReactions[emoji].users = users;
          }
        } else {
          // add reaction
          users[uid] = true;
          newReactions[emoji].users = users;
          newReactions[emoji].count = (newReactions[emoji].count || 0) + 1;
        }


        tx.update(msgRef, { reactions: newReactions });
      });
    } catch (err) {
      console.error("Failed to toggle reaction:", err);
    }
  };
  return (
    <>
      {/* <Toast title={"User reported successfully"} isOpen={showToast} / > */}

      {showSpinner ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div
            className="chat-messages p-3 no-scrollbar"
            style={{
              background: "#f5f7fb",
              minHeight: "70vh",
              overflowY: "auto",
              overflowX: "hidden" /* prevent horizontal scrollbar */,
            }}
          >
            {messages?.length > 0 ? (
              messages.map((mes, index) => (
                // Attach hover handlers to the whole wrapper so picker stays visible when cursor moves to it
                <div
                  key={mes.id}
                  className="message-wrapper position-relative"
                  style={{ marginBottom: "30px" }}
                  onMouseEnter={() => setHoveredMessage(mes.id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  {/* Date Divider */}
                  {formatTimestamp(messages[index - 1]?.createdAt, 1) !==
                    formatTimestamp(mes.createdAt, 1) && (
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
                          {/* 3-dots dropdown (to left of bubble for "my" messages) */}
                          <div className="me-2">
                            <button
                              className="btn btn-sm text-muted"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button
                                  onClick={() => deleteWallMessage(mes.id)}
                                  className="dropdown-item"
                                >
                                  <i className="fa fa-trash me-2 text-danger"></i> Delete
                                </button>
                              </li>
                            </ul>
                          </div>

                          {/* Message Content (bubble + emoji picker are both inside message-wrapper) */}
                          <div className="message-content" ref={bottomRef} style={{ position: "relative" }}>
                            {mes.type === "file" ? (
                              <div className="file-message">
                                <img src={mes.text} className="file-preview rounded" alt="Attachment" />
                              </div>
                            ) : (
                              <div className="bubble bg-primary text-white px-3 py-2 rounded-3 shadow-sm">
                                {mes.text}
                              </div>
                            )}

                            {/* Emoji Picker (positioned to the left of the bubble by using right:0) */}
                            <div
                              className="emoji-picker d-flex gap-1 p-1 rounded shadow-sm"
                              style={{
                                position: "absolute",
                                bottom: "100%",        /* place above bubble */
                                right: 0,              /* align to bubble's right edge and grow left */
                                /* remove margin gap so hover isn't lost */
                                background: "#fff",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                opacity: hoveredMessage === mes.id ? 1 : 0,
                                transform:
                                  hoveredMessage === mes.id ? "translateY(0)" : "translateY(6px)",
                                pointerEvents: hoveredMessage === mes.id ? "auto" : "none",
                                transition: "opacity 0.15s ease, transform 0.15s ease",
                                zIndex: 999,
                              }}
                            >
                              {EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  className="btn btn-sm"
                                  onClick={() => toggleReaction(mes.id, emoji)}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>

                            {/* Show reactions */}
                            {mes.reactions && (
                              <div className="d-flex gap-2 mt-1">
                                {Object.entries(mes.reactions).map(([emoji, info]) => {
                                  const reacted = info.users && info.users[currentUserId];
                                  return (
                                    <button
                                      key={emoji}
                                      className={`btn btn-sm ${reacted ? "btn-info" : "btn-light"}`}
                                      onClick={() => toggleReaction(mes.id, emoji)}
                                    >
                                      {emoji} {info.count}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <img
                        className="avatar ms-2 rounded-circle"
                        src={mes.image}
                        alt="Avatar"
                        style={{ width: 40, height: 40 }}
                      />
                    </div>
                  ) : (
                    /* Left Side */
                    <div className="chat-message d-flex justify-content-start mb-3">
                      <img
                        className="avatar me-2 rounded-circle"
                        src={mes.image}
                        alt="Avatar"
                        style={{ width: 40, height: 40, cursor: "pointer" }}
                        onClick={() => getUserId(mes)}
                      />

                      <div className="d-flex flex-column align-items-start position-relative">
                        {/* Bubble + Dropdown in same row */}
                        <div className="d-flex align-items-center" style={{ position: "relative" }}>
                          {mes.type === "file" ? (
                            <div className="file-message small">
                              <img
                                src={mes.text}
                                className="file-preview small rounded"
                                alt="Attachment"
                              />
                            </div>
                          ) : (
                            <div className="bubble bg-light text-dark px-3 py-2 rounded-3 shadow-sm">
                              {mes.text}
                            </div>
                          )}

                          {/* Dropdown aligned to right of bubble */}
                          <div className="ms-2">
                            <button
                              className="btn btn-sm text-muted"
                              type="button"
                              data-bs-toggle="dropdown"
                            >
                              <i className="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">

                              <li>
                                <button
                                  onClick={() => sendUserIdForReport(mes.user)}
                                  className="dropdown-item"
                                >
                                  <i className="fa fa-flag me-2 text-warning"></i> Report user
                                </button>
                              </li>
                            </ul>
                          </div>

                          {/* Emoji Picker for left side (aligns to left) */}
                          <div
                            className="emoji-picker d-flex gap-1 p-1 rounded shadow-sm"
                            style={{
                              position: "absolute",
                              bottom: "100%",
                              left: 0,
                              background: "#fff",
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                              opacity: hoveredMessage === mes.id ? 1 : 0,
                              transform:
                                hoveredMessage === mes.id ? "translateY(0)" : "translateY(6px)",
                              pointerEvents: hoveredMessage === mes.id ? "auto" : "none",
                              transition: "opacity 0.15s ease, transform 0.15s ease",
                              zIndex: 999,
                            }}
                          >
                            {EMOJIS.map((emoji) => (
                              <button
                                key={emoji}
                                className="btn btn-sm"
                                onClick={() => toggleReaction(mes.id, emoji)}
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>

                        {mes.reactions && (
                          <div className="d-flex gap-2 mt-1">
                            {Object.entries(mes.reactions).map(([emoji, info]) => {
                              const reacted = info.users && info.users[currentUserId];
                              return (
                                <button
                                  key={emoji}
                                  className={`btn btn-sm ${reacted ? "btn-info" : "btn-light"}`}
                                  onClick={() => toggleReaction(mes.id, emoji)}
                                >
                                  {emoji} {info.count}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        <p className="username mb-1 fw-bold text-primary small">{mes.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-messages text-center my-5">
                <h5 className="text-muted">💬 No messages yet</h5>
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
