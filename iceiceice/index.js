import { initializeApp } from 'firebase/app'
import { // call functions made here
    getFirestore, collection, onSnapshot, // collection and updates
    addDoc, deleteDoc, doc,//book editing
    query, where,//search bars
    orderBy, serverTimestamp,//timestamps and order
    getDoc, updateDoc,//update

} from 'firebase/firestore'
import{
  getAuth,
  createUserWithEmailAndPassword,
  signOut, signInWithEmailAndPassword,
  onAuthStateChanged
}from 'firebase/auth'


const firebaseConfig = {//firestore details important
  apiKey: "AIzaSyDNJQ3mVwHd3UQfHpABczul94S7idozL1c",
  authDomain: "inkwell-sys.firebaseapp.com",
  projectId: "inkwell-sys",
  storageBucket: "inkwell-sys.appspot.com",
  messagingSenderId: "160191100269",
  appId: "1:160191100269:web:33a4f759c15457bc451664",
  measurementId: "G-L3HLG1MBMY"
};


  // init firebase app
  initializeApp(firebaseConfig)

  //init services
  const db = getFirestore()
  const auth =getAuth()

  //collection references
  const colRef = collection(db, 'books')

  //queries
  const q1 = query(colRef, orderBy('createdAt'))
  //for choosing what to search for (title, author....)
  const q2 = query(colRef, where("title", "==", "Harry Potter"))

  //real time collection
const unsubCol = onSnapshot(q1, (snapshot) => {//currently q1
  let books = []
  snapshot.docs.forEach((doc)=> {
      books.push({...doc.data(), id: doc.id})
  })
  console.log(books)
})


//adding documents
const addBookForm = document.querySelector('.add')

addBookForm.addEventListener('submit', (e) => {

  e.preventDefault()//to prevent refreshing the page

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    datepub: addBookForm.datepub.value,
    class: addBookForm.class.value,
    createdAt: serverTimestamp()
  })
  .then(() => {
    addBookForm.reset()
  })
  .catch((error) => {
    console.error("Error adding document: ", error);
});//fine

})


//deleting documents
const deleteBookForm = document.querySelector('.delete')

deleteBookForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef =  doc(db, 'books', deleteBookForm.id.value)

  deleteDoc(docRef)
    .then(() =>{
      deleteBookForm.reset()
    })
})//change to delete using title or get book id through frontend

//single doc (subscription)
const docRef = doc(db, 'books', 'wr2selTWj4I9Wvq2ldtR')

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id)

})//idk this yet


//updating documents
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const docRef = doc(db, 'books', updateForm.id.value)

  updateDoc(docRef, {
    title: 'Updated Title'//this is new title of the book
  })
  .then(() => {
    updateForm.reset()
  })
    
})//need author, datepub updates


//signup users
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred)=>{

       //console.log('User Created:', cred.user)
       signupForm.reset()

    })
    .catch((err) => {
      console.log(err.message)
    })

})

const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() =>{
      //console.log('The User has Signed Out')
    })
    .catch((err)=>{
      console.log(err.message)
    })

})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email, password)
    .then((cred)=>{
      //console.log('User Logged in: ', cred.user)

    })
    .catch((err) => {
    console.log(err.message)
  })

})


//subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) =>{
  console.log('User Status Changed: ', user)

})

//unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () =>{
  console.log('unsubscribing')
  unsubCol()
  unsubDoc()
  unsubAuth()
})//try not to click










