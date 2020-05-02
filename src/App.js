import React, { useState } from 'react';
import './App.css';
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebase-config';
firebase.initializeApp(firebaseConfig)
function App() {
  //state
  const [user,setUser] = useState({
    isSignedIn:false,
    name:'',
    email:'',
    photo:'',
    password:''
  })
  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn=()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res=> {
      const {displayName,photoURL,email} = res.user;
      const ifSignedIn = {
        isSignedIn:true,
        name:displayName,
        email:email,
        photo:photoURL
      }
      setUser(ifSignedIn);
    }).catch(error=>{
      
    })
  }
  //login form
  const signInForm = event =>{
    if(user.isValid){
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err=>{
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      });
    }
    event.preventDefault();
    event.target.reset();
  }
  //switch form
  const switchForm = (e)=>{
    const createdUser = {...user};
        createdUser.existingUser = e.target.checked;
        setUser(createdUser);
  }
  //signout
  const handleSignOut=()=>{
    firebase.auth().signOut()
    .then(res=>{
      const ifSignedOut = {
        isSignedIn:false,
        name:'',
        email:'',
        photo:'',
        password:'',
        error:'',
        isValid:false,
        existingUser:false
      }
      setUser(ifSignedOut);
    })
    .catch(err=>{

    })
    
  }
  var is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email); 
  const handleChange = (e) =>{
    const newUserInfo = {
      ...user
    };
    newUserInfo[e.target.name] = e.target.value;
    setUser(newUserInfo);
      //perform validation
      let isValid = true;
      if(e.target.name === 'email'){
       isValid=is_valid_email(e.target.value);
      }if(e.target.name === 'password'){
        isValid = e.target.value.length >8 
      }
      newUserInfo[e.target.name] = e.target.value;
      newUserInfo.isValid = isValid;
      setUser(newUserInfo)
  }
  const handleCreateAccount=(e)=>{
    if(user.isValid){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
      .then(res=>{
        const createdUser = {...user};
        createdUser.isSignedIn = true;
        createdUser.error = '';
        setUser(createdUser);
      })
      .catch(err=>{
        console.log(err)
        const createdUser = {...user};
        createdUser.isSignedIn = false;
        createdUser.error = err.message;
        setUser(createdUser);
      });
    }
    e.preventDefault();
    e.target.reset();
  }

  return (
    <div className="App">
       <div>
       
        { user.isSignedIn ? <button onClick={handleSignOut}>Sign out</button> : 
          <button onClick={handleSignIn}>Sign in</button>
        }
       </div>
        {
          user.isSignedIn && 
          <div>
            <p>welcome, {user.name}</p>
            <p>welcome, {user.email}</p>
            <p><img src={user.photo} alt=""/></p>
          </div>
        }
        <h1>Our Own Authentication</h1>
        {/* login form */}
        <input type="checkbox" name="switchForm" onChange={switchForm} id="switchForm" />
        <label htmlFor="switchForm">Returning user <br/>
        
        </label> 
       <form style={{display:user.existingUser ? 'block' : 'none'}} onSubmit={signInForm}>
          <input type="text" name="email" onBlur={handleChange} placeholder="Email" required />
        <br/>
        <br/>
        <input type="password" name="password"  onBlur={handleChange} placeholder="Password" required />
        <br/>
        <br/>
        <input type="submit" value="SignIn"/>
       </form>
       {/* register form */}
       <form style={{display:user.existingUser ? 'none' : 'block'}} onSubmit={handleCreateAccount}>
          <input type="text" name="name" onBlur={handleChange} placeholder="Name" required />
          <br/>
          <br/>
          <input type="text" name="email" onBlur={handleChange} placeholder="Email" required />
        <br/>
        <br/>
        <input type="password" name="password"  onBlur={handleChange} placeholder="Password" required />
        <br/>
        <br/>
        <input type="submit" value="Create Account"/>
       </form>
      {user.error && <p style= {{color:'red'}}>{user.error}</p>}
    </div>
  );
}
export default App;
