import React, { useState } from 'react';
import { useEffect } from 'react';
import { TextField } from '@mui/material';
import './Login.css';
import Axios from 'axios';

function Login(props) {

    const [tickets, setTickets] = useState(0);
    const [loggedIn, setLoggedIn] = useState(false);

    function newLogin(name) {
        Axios.post('http://localhost:3256/newuser', {
            id: name,
            tickets: 0,
        })
        .then(function(response) {
            console.log('response successfully received, response below')
            console.log(response)
        }).catch(function (error) {
            console.log('response unsusccessfully received, error below')
            console.log(error)
        }).finally(function (){
            console.log("This part is always executed no matter what")
        }) 
    }

    function Login(name) {
        var url = `http://localhost:3256/login?username=${name}`;
        Axios.get(url)
        .then(function (response) {
            console.log('response successfully received, response below')
            console.log(response)

            if (response.data.rowCount == 0) {
                newLogin(name);
                setTickets(0);
            } else {
                setTickets(response.data.rows[0].user_tickets)
            }

            setLoggedIn(true);
  
        }).catch(function (error) {
            console.log('response unsusccessfully received, error below')
            console.log(error)
        }).finally(function (){
            console.log("This part is always executed no matter what")
        }) 
    }

    function incTix(name) {
        var url = `http://localhost:3256/inctix?username=${name}`;
        Axios.get(url)
        .then(function(response) {
            console.log('response successfully received, response below')
            console.log(response)
            setTickets(tickets => tickets + 1)
        }).catch(function (error) {
            console.log('response unsusccessfully received, error below')
            console.log(error)
        }).finally(function (){
            console.log("This part is always executed no matter what")
        }) 
    }

    function pickWinner() {
        Axios.get('http://localhost:3256/winner')
        .then(function(response) {
            console.log('response successfully received, response below')
            console.log(response)
            setShowWinner(true);
            setWinner(response.data.rows[0].user_id)
        }).catch(function (error) {
            console.log('response unsusccessfully received, error below')
            console.log(error)
        }).finally(function (){
            console.log("This part is always executed no matter what")
        }) 
    }

    const [showTix, setShowTix] = useState(false);
    const [username, setUsername] = useState('');
    const [showWinner, setShowWinner] = useState(false);
    const [winner, setWinner] = useState('');

    const handleButtonClick = () => {
        Login(username);
        setShowTix(true);
    };

    return (
        <div className = "Login">
            <TextField id="outlined-basic" label="Username" variant="outlined" value={username} onChange={event => setUsername(event.target.value)}/>
            <button onClick={handleButtonClick}>login</button>
            {showTix ? (
                <div className = "Info">
                    <p>you have {tickets} tickets.</p>
                    <button id="tix" onClick={e => incTix(username)}>buy tickets!</button>
                    <button id="pick" onClick={e => pickWinner()}>pick a winner!</button>
                </div>
            ) : (
                <p>Please login.</p>
            )}
            {showWinner ? (
                <p>the winner is {winner}! congratulations.</p>
            ) : (
                <p></p>
            )}
        </div>
    );
};

export default Login;