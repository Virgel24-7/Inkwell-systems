import React, { useState } from "react";
import { auth } from '../../firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";

const SignIn = (e) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState ('');
    
    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log(userCredential)
            }) 
            .catch((error) => {
                console.log(error)
            })
        setEmail('');
        setPassword('');
    }
    return (
        <div className="sign-in-container">
            <form onSubmit={(signIn)}>
                <h1>Log In</h1>

            <div className="input-box">
             <input 
                type="email" 
                placeholder="Email" 
                    value ={email}
                    onChange={(e) => setEmail(e.target.value)}>
                </input>
            </div>
               
            <div className="input-box">
                 <input 
                type="password" 
                placeholder="Password" 
                    value ={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
                <button type="submit">Log In</button>
            </div>
               
            </form>
        </div>
    );
};

export default SignIn;
