import React, { useState } from "react";
import { auth } from '../../firebase-config';//change to where ur firebase.js or something is
import { createUserWithEmailAndPassword } from "firebase/auth";

const SignUp = (e) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState ('');
    
    const signUp = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
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
            <form onSubmit={(signUp)}>
                <h1>Create Account</h1>
                <input 
                type="email" 
                placeholder="Email" 
                    value ={email}
                    onChange={(e) => setEmail(e.target.value)}>
                </input>

                <input 
                type="password" 
                placeholder="Password" 
                    value ={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
                <button type="submit">Sign Up User</button>
            </form>
        </div>
    );
};

export default SignUp;