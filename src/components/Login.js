import React, { useState } from 'react';
import { TextField } from '@mui/material';
import './Login.css';
import Axios from 'axios';

function Login(props) {

    const [tickets, setTickets] = useState([]);

    function newLogin(name) {
        const data = {
            id: name,
            tickets: 0,
        };
        //console.log(data);
        Axios.post('http://localhost:3256/newuser', {
            id: name,
            tickets: 0,
        })
        .then(function(response) {
            console.log(response)
        }).catch(function (error) {
            console.log('response unsusccessfully received, error below')
            console.log(error)
        }).finally(function (){
            console.log("This part is always executed no matter what")
        }) 
    }

    function getTix() {
      Axios.get('http://localhost:3256/login')
      .then(function (response) {
          console.log('response successfully received, response below')
          console.log(response)
  
          //set message to be response we get from backend
          //setBoxes(prevArray => [...prevArray, <Box num={response.data.value}/>]);
  
      }).catch(function (error) {
          console.log('response unsusccessfully received, error below')
          console.log(error)
      }).finally(function (){
          console.log("This part is always executed no matter what")
      }) 
    }

    const [username, setUsername] = useState('');
    // function setName() {
    //     setUsername(username)
    // }

    return (
        <div className = "Login">
            <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={event => setUsername(event.target.value)}/>
            <button onClick={e => newLogin(username)}>login</button>
        </div>
    );
};

export default Login;