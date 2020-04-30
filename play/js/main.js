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
        this._mainText = text;
        this._UnEditedtext = nlp(text);
        this._UnEditedtext.contractions().expand();
        this._text = replacer(this._UnEditedtext);
        this._intent = intentArray(this._text)

    }
}


let ifIn = (term, list) => {
    for(let i = 0; i < list.length; i++){
        if(term == list[i]){
            return true;
        }
    }
    return false;
}
let searchCheck = (terms, i , termsText) => {
    let k = 0;
    termsText.forEach(ele => {
        if(terms[i++] == ele.text){
            k++;
        }
    })
    if(k == termsText.length){
        return true;
    }
    else{
        return false;
    }
}

let concat = (terms) =>{
    let str = "";
    terms.forEach((ele,i) => {
        str+=ele.text;
        if(i != (terms.length-1)){
            str+= " ";
        }
    })
    return str;
}

let Intenthas = (intent) => {
    let a = 0;
    for(let i = 0; i < intent.length; i++){
        if(intent[i][1] == "noun"){
            a++;
        }
        if(intent[i][1] == "verb"){
            a++;
        }
    }
    if(a >= 2){
        return true;
    }
    else{
        return false;
    }
}



/* Sentence Class: End */
let text1 = new sentence("open the door using the keys")
console.log(text1._intent)

/* Generating Intent JSON */









function intentArray(text) {
    console.log(text.termList())
    let terms = text.terms().out("array");
    let nouns = text.nouns().out('array')
    let verbs = text.verbs().out('array')
    let adjs = text.adjectives().out('array');
    let verbsjson = text.verbs().json();
    verbsjson.forEach(ele => {
        if(ele.isNegative){
            console.log(ele)
            terms.forEach((elem, i) => {
                if(elem == ele.terms[0].text){
                    if(searchCheck(terms,i,ele.terms)){
                        terms.splice(i, ele.terms.length, concat(ele.terms));
                    }
                }
            })
        }
    });
    console.log(terms)
    console.log(nouns, verbs, adjs)
    let intent = [];
    let masterIntent = [];
    for(let i = terms.length - 1; i >= 0; i--){
        if(ifIn(terms[i],nouns)){
            let noun = [terms[i], "noun"];
            /* console.log("noun") */
            intent.push(noun);
        }
        if(ifIn(terms[i],adjs)){
            let adj = [terms[i],"adj"];
            intent.push(adj)
        }
        if(ifIn(terms[i],verbs)){
            /* console.log("verb") */
            let verb = [terms[i],"verb"];
            intent.push(verb);
        }
        if(Intenthas(intent)){
            masterIntent.push(intent.reverse())
            intent = [];
        }
    }
    return (masterIntent.reverse())
}





/* Generating Intent JSON: End */



/* Generating intent String */

/* let intentText = (json) => {
    let str = "";
    json.forEach(wordObj => {
        str += wordObj.text;
        str += " ";
    })
    return str;
} */

/* Generating intent String: End */

/* 
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
 */









