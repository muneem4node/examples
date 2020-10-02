var Muneem = require("muneem");
var Anuvadak = require("anuvadak");
var path = require("path");
const satr = require("satr");
const Satr = new satr();

const CLIENT_ID = "CLIENT_ID.apps.googleusercontent.com";
var app = Muneem({
    server : {
        requestId : true,
        port : 7788
    }
});

app.use(Anuvadak.urlForm);
app.use(Anuvadak.sendFiles, {
    root : path.join(__dirname, "static" )
});
app.use(Satr.manager, {
    secret : "keep it secret and complex that no one can guess",
    cookie : {
        secure : false
    }
});

function authentication(asked, answer, giveMe){
    const session = asked.getSession(); 
    if( !session.authorized ){
        asked.hasSession = false; 
        answer.redirectTo("/login.html?sendTo=" + asked.path);
    }
}

var googleSignInHandler = async function(asked, answer){
    await asked.readUrlForm();
    const userid = await verifyTokenId(asked.body.idtoken);
    if(userid){
        const session = asked.getSession(); 
        session.authorized = true;
        answer.write( "ok" );
    }else{
        answer.close(403)
    }
}

function logoutHandler(asked, answer, giveMe){
    var session = asked.getSession();
    session.authorized = false;
    session.end();
    asked.hasSession = false;
    answer.redirectTo( "/" );
}

var loadStatic = function(asked, answer){
    answer.sendFile();
}

app.route([{
    uri : "/logout",
    to : logoutHandler,
},{
    uri : "/login/google",
    when : "POST",
    to : googleSignInHandler,
},{
    uri : "/login.html",
    to : loadStatic,
},{
    uri : "/",
    to : loadStatic,
},{
    uri : "/dashboard.html",
    to : loadStatic,
    after: authentication
}]);

app.start();


const {OAuth2Client} = require('google-auth-library');

const client = new OAuth2Client(CLIENT_ID);
async function verifyTokenId(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
        //maxExpiry: 
    });
    return ticket.getPayload();
    
    
    const userid = payload['sub'];
    return userid;
    //check if the user is present in the DB
    //if not save in DB
    //then create a new session and send session id to the user. So that you need not to verify token id for every request
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
}
