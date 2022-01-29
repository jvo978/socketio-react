import './App.css';
import io from 'socket.io-client'
import Chat from './Components/Chat'
import { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';


const socket = io.connect("https://socketio-react-jvo978.herokuapp.com")

function App() {

const [room, setRoom] = useState("")
const [username, setUsername] = useState("")
const [showChat, setShowChat] = useState(false)


const joinRoom = () => {
  if (username !== "" & room !== "") {
      socket.emit("join_room", { username, room })
      setShowChat(true)
  } else {
    alert("username and roomname are must !");
    window.location.reload();
  }
}

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChat__container">
        <h1>Join Room</h1>
        <TextField autoComplete="off" id="outlined-basic" label="Username" variant="outlined" onChange={(event) => { setUsername(event.target.value) }} />
        <FormControl margin="normal">
          <InputLabel id="select-label">Room</InputLabel>
          <Select
            labelId="select-label"
            label="Room"
            value={room}
            onChange={(event) => { setRoom(event.target.value) }}
          >
            <MenuItem disabled value="">
              <em>-- Select a Room --</em>
            </MenuItem>
            <MenuItem value="Cars">Cars</MenuItem>
            <MenuItem value="Politics">Politics</MenuItem>
            <MenuItem value="Sports">Sports</MenuItem>
            <MenuItem value="Foods">Foods</MenuItem>
          </Select>
        </FormControl>
          <Button sx={{ marginTop: "5px", height: "45px" }} variant="outlined" onClick={joinRoom}>Join a room</Button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} setRoom={setRoom} setShowChat={setShowChat} />
      )
      }
    </div>
  );
}

export default App;
