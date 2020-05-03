let masterData;
let option1Text;
let option2Text;
let nouns;
let mainDescription;
let mainTitle;
let option1;
let option2;
let options;
let userInput;
let userIntent;
let userNouns = [];
let descs;




let output = (text) => {
    console.log(text)
}










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
        .then(result => {
            extractInfo(result);
        })
        .catch(error => console.log('error', error));
}
play();

let chooseOption = (data) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", sessionStorage.getItem("auth_key"));
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "option": data });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://playscenario.dscvit.com/api/bandersnatch/play", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            resetVariables();
            extractInfo(result);
        })
        .catch(error => console.log('error', error));
}








let optionsIntent = () => {
    option1 = new sentence(option1Text)
    console.log("Option 1 Intent: ", option1._intent);
    option2 = new sentence(option2Text)
    console.log("Option 2 Intent: ", option2._intent)
    options = [option1, option2];
}







let extractInfo = (data) => {
    masterData = data["data"];
    console.log(masterData)
    mainDescription = masterData["content"];
    mainTitle = masterData["misc"]["title"];
    option1Text = masterData["misc"]["left_option"];
    option2Text = masterData["misc"]["right_option"];
    nouns = masterData["misc"]["descriptions"];
    console.log(mainDescription)
    optionsIntent();
}


let compare = (arr1, arr2) => {
    // console.log(arr1, arr2)
    let masterFlag = 0;
    for (let i = 0; i < arr1.length; i++) {
        let flag = 0;
        for (let j = 0; j < arr1[i].length; j++) {
            // console.log(arr1[i][j][0], arr2[i][j][0])
            if (arr1[i][j][0] == arr2[i][j][0]) {
                flag++;
            }
        }
        // console.log(flag, arr1[i])
        if (flag == (arr1[i].length)) {
            masterFlag++;
        }
    }
    // if(arr1.length == 1){
    //     if(masterFlag == 1){
    //         return true;
    //     }
    //     else{
    //         return false;
    //     }
    // }
    if (masterFlag == (arr1.length)) {
        return true;
    }
    return false;
}



let resetForNewInput = () => {
    userInput = undefined;
    userIntent = undefined;
    userNouns = [];

}











let nounMaster = () => {
    let presentNoun;
    let nounDescs = [];
    for (let i = 0; i < userNouns.length; i++) {
        presentNoun = false;
        for (let ele in nouns) {
            if (ele == userNouns[i]) {
                presentNoun = true;
                nounDescs[ele] = nouns[ele];
                break;
            }
        }
        if (!presentNoun) {
            output(`Noun: "${userNouns[i]}" not present in the env`)
            resetForNewInput();
            return;
        }
    }
    if (compare(userIntent._intent, option1._intent)) {
        output("1 : chosen");
        chooseOption(0)
        return;
    }
    if (compare(userIntent._intent, option2._intent)) {
        output("2 : chosen")
        chooseOption(1)
        return;
    }
    if (userIntent._intent[0][0][0] == "inspect") {
        for (let ele in nounDescs) {
            if (ele == userNouns[0]) {
                output(nounDescs[ele])
            }
        } resetForNewInput();
        return;
    }
    output("random user input to be programmed")
    resetForNewInput();


    // for (let i = 0; i < userIntent.length; i++) {
    //     for (let j = 0; j < option1.length; j++) {
    //         if (userIntent[i] == option1[j]) {
    //             output("1 : chosen");
    //         }
    //     }

    // }
}






let validateInput = (intent) => {
    console.log(intent)
    if (intent[0][0] == "inspect") {
        if (intent.length != 1) {
            console.log("not one")
            return false;
        }
        else {
            // return true;
            return false;
        }
    }
    return false;
}











let processInput = (input) => {
    userInput = input;
    userIntent = new sentence(userInput);
    console.log(userIntent._intent)
    if (validateInput(userIntent._intent)) {
        userIntent._intent.forEach(ele => {
            let pushing = "";
            ele.forEach(elem => {
                if (elem[1] == "adj") {
                    pushing += elem[0] + " ";
                }
                if (elem[1] == "noun") {
                    pushing += elem[0];
                }
            })
            userNouns.push(pushing)
        });
        nounMaster();

    }
    else{
        resetForNewInput();
    }
}







let resetVariables = () => {
    masterData = undefined;
    option1Text = undefined;
    option2Text = undefined;
    nouns = undefined;
    mainDescription = undefined;
    mainTitle = undefined;
    option1 = undefined;
    option2 = undefined;
    options = undefined;
    userInput = undefined;
    userIntent = undefined;
    userNouns = [];
    descs = undefined;



}

let inputDiv = document.querySelector(".user_input");
let submit = document.querySelector(".submit")
submit.addEventListener("click", () => { processInput(inputDiv.value) });





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









