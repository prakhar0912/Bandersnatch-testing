let play = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", sessionStorage.getItem("auth_key"))
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "start": true });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://playscenario.dscvit.com/api/bandersnatch/play", requestOptions)
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
/* play(); */


/* Sentence Class */

class sentence {
    constructor(text) {
        this._text = nlp(text);
        this._mainText = text;
        this._nouns = this._text.nouns().json();
        this._verbs = this._text.verbs().json();
        this._verbs = replacer(this._verbs);
        this._intentJson = intentJson(this._verbs, this._nouns);
        this._intentText = intentText(this._intentJson);
    }

    get nouns() {
        return this._nouns;
    }

    get verbs() {
        return this._verbs;
    }

    get intent() {
        return this._intentJson;
    }

    get intentText() {
        return this._intentText;
    }
}

/* Sentence Class: End */



/* Generating Intent JSON */

function intentJson(verbs, nouns) {
    let json = [];
    let a = 0, g = 0;
    if(nouns.length == 0 || verbs.length == 0){
        console.log("I can't waste all day doing nothing");
        return;
    }
    for (let i = 0; i < (nouns.length + verbs.length); i++) {
        if (i % 2 == 0) {
            json.push(verbs[a]);
            a++;
        }
        else {
            json.push(nouns[g]);
            g++;
        }
    }
    return json;
}

/* Generating Intent JSON: End */



/* Generating intent String */

let intentText = (json) => {
    let str = "";
    json.forEach(wordObj => {
        str += wordObj.text;
        str += " ";
    })
    return str;
}

/* Generating intent String: End */




let question = "You are in a room and there are 3 objects a door, a bed, and a joker card what will you do?";
console.log(question)
let option1Text = "Open the door";
let option2Text = "lay in the bed";
let nouns = {
    'door': 'This door is made of wood',
    'bed': "It's a nice comfy bed",
    'joker card': "Hmmm is there blood on this!?",
    'floor': "Looks like the floor is made of marble",
};

let describingVerbs = ["check", "view", "inspect", "investigate", "read", "hold", "pick up"]
let option1 = new sentence(nlp(option1Text).text('clean'))
console.log("The option 1 intent: ", option1.intentText)
let storyActionVerb = [];
let storyNouns = [];
let optionIntents = [];
storyActionVerb.push(option1.verbs[0]);
storyNouns.push(option1.nouns[0])
optionIntents.push(option1.intentText)

let option2 = new sentence(nlp(option2Text).text('clean'))
console.log("The option 2 intent: ", option2.intentText);
storyActionVerb.push(option2.verbs[0])
storyNouns.push(option2.nouns[0])
optionIntents.push(option2.intentText)



let userInputText = "pick up the joker card";
let userInput = new sentence(nlp(userInputText).text('clean'))
console.log("The users intent is to: ", userInput.intentText);







let output = (text) => {
    console.log(text);
}











let handleVerbs = (verb, noun) => {
    if (verb == "jump") {
        output(`Why even try jumping on the ${noun}`);
    }
    describingVerbs.forEach(Dverb => {
        if (verb == Dverb) {
            output(nouns[noun]);
        }
    })
}


















let exists = false;

let nounMaster = () => {
    let flag = false;
    optionIntents.forEach((ele, i) => {
        if (ele == userInput.intentText) {
            flag = true;
            console.log("Option ", i , "chosen")
        }
    })
    if (flag == false) {
        for (let i = 0; i < userInput.nouns.length; i++) {
            if(nouns[userInput.nouns[0].text]){
                exists = true;
            }
        }
        if (exists == false) {
            output(`${userInput.nouns[0].text} does not exist in the environment`);
        }
        else {
            handleVerbs(userInput.verbs[0].text, userInput.nouns[0].text);
        }
    }
}
nounMaster();









