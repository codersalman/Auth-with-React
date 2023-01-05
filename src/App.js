import './App.css';
import axios from "axios";
import queryString from 'query-string';
import { initializeApp } from "firebase/app";

import { getAuth, signInWithPopup } from "firebase/auth";
import { TwitterAuthProvider } from "firebase/auth";
import {Base64} from 'js-base64';

let ID = '397d1772-82fd-468b-9f1e-d6b940575770';
let SECRET = 'secret_ctLnRtGTD5hcPZZuHsj0IQAk56MoLjYWZOT6GpMYPzw';


const NOTION_CLIENT_ID = '';
const NOTION_REDIRECT_URI = 'https://auth-with-react.pages.dev/notion/callback';

async function handleNotionLogin() {
    // Redirect the user to the Notion OAuth 2.0 authorization URL
    // https://api.notion.com/v1/oauth/authorize?client_id=397d1772-82fd-468b-9f1e-d6b940575770&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F
    window.location.replace(
        // `https://api.notion.com/v1/oauth/authorize?client_id=397d1772-82fd-468b-9f1e-d6b940575770&response_type=code&owner=user&redirect_uri=${NOTION_REDIRECT_URI}`
`https://api.notion.com/v1/oauth/authorize?client_id=397d1772-82fd-468b-9f1e-d6b940575770&response_type=code&owner=user&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fnotion%2Fcallback`
    );
}

    if (window.location.pathname === '/notion/callback') {
        handleNotionCallback().then(r => console.log(r));
    }

async function handleNotionCallback() {
    // Extract the authorization code from the query string
    const queryParams = queryString.parse(window.location.search);
    const code = queryParams.code;

    // Exchange the authorization code for an access token

    const tokenResponse = await axios.post(
        'https://api.notion.com/v1/oauth/token',

        {

            code,
            redirect_uri: NOTION_REDIRECT_URI,
            grant_type: 'authorization_code'
        },
    {
        headers: {
            "Authorization": `Basic ` + Base64.encode(`${ID}:${SECRET}`),
            'Content-Type': 'application/json',
        }}
    );


    const accessToken = tokenResponse.data.access_token;

    alert(`Access token: ${accessToken}`);

    // Now that you have an access token, you can use the Notion API to perform authorized actions on behalf of the user
    const userResponse = await axios.get('https://api.notion.com/v3/get-current-user', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    const user = userResponse.data;
    console.log(`Logged in as ${user.name}`);
}



function App() {
    const firebaseConfig = {
        apiKey: "AIzaSyAGuOhV3jP8Z5F1nPBBlWoXSBIJd_9ZaRY",
        authDomain: "scattr-hq.firebaseapp.com",
        databaseURL: "https://scattr-hq-default-rtdb.firebaseio.com",
        projectId: "scattr-hq",
        storageBucket: "scattr-hq.appspot.com",
        messagingSenderId: "442287485335",
        appId: "1:442287485335:web:0c96596d721cbab47dd4d2",
        measurementId: "G-1NT5NJK8ZS"
    };
    const provider = new TwitterAuthProvider();

    const app = initializeApp(firebaseConfig);


    function login(){

        const auth = getAuth(app);
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
                // You can use these server side with your app's credentials to access the Twitter API.
              console.log(result.credential)
                const credential = TwitterAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const secret = credential.secret;

                console.log(credential)

            const cred = {
                token:token,
                secret:secret
                }

                twit(cred)

                // ...
            }).catch((error) => {
            // Handle Errors here.
            console.log(error)
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = TwitterAuthProvider.credentialFromError(error);
            // ...
        });


        function twit(cred) {


            console.log(cred);
        }
}









  return (
    <div className="App">
      <header className="App-header">

<button className="App-link" onClick={login}>
  Login with twitter
</button><button className="App-link" onClick={handleNotionLogin}>
  Login with Notion
</button>

      </header>
    </div>
  );
}

export default App;
