import { useEffect, useState } from 'react'
import './Chat.css'
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import ScrollToBottom from 'react-scroll-to-bottom'
import CloseIcon from '@mui/icons-material/Close';

function Chat({ socket, username, room, setShowChat, setRoom }) {

const [currentMessage, setCurrentMessage] = useState("")
const [messageList, setMessageList] = useState([])

const getTime = () => {
    let hours = new Date().getHours();
    let minutes = new Date().getMinutes();
    let seconds = new Date().getSeconds();
    let amOrPm = (hours < 12 || hours === 24) ? "AM" : "PM"
    minutes = minutes < 10 ? ("0" + minutes) : minutes;
    seconds = seconds < 10 ? ("0" + seconds) : seconds;
    hours = (hours % 12) || 12
    let finalTime = hours + ":" + minutes + ":" + seconds + " " + amOrPm;

    return finalTime;
}

const sendMessage = async () => {
    if (currentMessage !== "") {
        const messageData = {
            id: socket.id,
            room,
            username,
            time: getTime(),
            message: currentMessage
        }
        await socket.emit("send_message", messageData)
        setMessageList((list) => [...list, messageData])
        setCurrentMessage("")     
    }
}

const leaveRoom = () => {
    socket.emit("leave_room", { username, room })
    setShowChat(false)
    setRoom("")
}

useEffect(() => {
    socket.on("receive_message", (messageData) => {
        if (!messageData.time) {
            messageData.time = getTime()
        }
        setMessageList((list) => [...list, messageData])
    })
}, [socket])

  return (
    <div className='chat__container'>
        <div className='chat__topic'>{room}</div>
        <div className="chat__header">
            <div className="circleBtn"></div><p>Live Chat</p>
            <CloseIcon className='exit' onClick={leaveRoom} />
        </div>
        <div className="chat__body">
            <ScrollToBottom className="message__container">
            {messageList.map((msg, index) => { 
                return (
                <div className='message__info' key={index} id={socket.id === msg.id ? "me" : "other"}>
                    <div>
                        <div className="message__content">
                            <p>{msg.message}</p>
                        </div>
                        <div className='message__meta'>
                            <p id="time">{msg.time}</p>
                            <p id="username">{msg.username}</p>
                        </div>
                    </div>
                </div>
                )
            })}
            </ScrollToBottom>
        </div>
        <div className="chat__footer">
            <input type="text" value={currentMessage} placeholder="Chat here..." onChange={(event) => {
                setCurrentMessage(event.target.value)
            }} onKeyPress={(event) => event.key === 'Enter' && sendMessage()} />
            <Button onClick={sendMessage} variant="contained" endIcon={<SendIcon />}>Send</Button>
        </div>
    </div>
  )
}

export default Chat;
