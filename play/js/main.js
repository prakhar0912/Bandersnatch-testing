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
let terminal;
terminal = new Terminal();
document.querySelector("#terminal").appendChild(terminal.html)


let terminalInit = () => {

    let email;
    let pass;
    terminal.printSlow("Login to play Bandersnatch!").then(() => {
        terminal.input("Email: ", (input) => {
            email = input;
            terminal.printSlow("Password: ").then(() => {
                terminal.password("", (input) => {
                    pass = input;

                    var myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");

                    var raw = JSON.stringify({ "email": email, "password": pass });
                    console.log(raw)
                    var requestOptions = {
                        method: 'POST',
                        headers: myHeaders,
                        body: raw,
                        redirect: 'follow'
                    };

                    fetch("https://playscenario.dscvit.com/api/bandersnatch/signin", requestOptions)
                        .then(response => response.json())
                        .then(result => {
                            console.log(result);
                            sessionStorage.setItem("auth_key", result["token"])
                            console.log(sessionStorage.getItem("auth_key"))
                            if (result.token) {
                                terminal.printSlow("Logged In!", "green").then(() => {
                                    terminal.printSlow("The Game begins in:").then(() => {
                                        let i = 5;
                                        let timer = setInterval(() => {
                                            if (i < 1) {
                                                clearInterval(timer);
                                                terminal.clear();
                                                play();
                                            }
                                            else {
                                                terminal.printSameLine(`${i}  `);
                                                i--;
                                            }
                                        }, 1000)
                                    })


                                })
                            }
                            else {
                                terminal.printSlow("Error!", "red").then(() => {
                                    terminal.printSlow("Enter any key to Retry").then(() => {
                                        terminal.input(" ", () => {
                                            terminal.clear();
                                            terminalInit();

                                        })
                                    })
                                });
                            }
                        })
                        .catch(error => {
                            console.log('error', error);
                            terminal.printSlow("Error!", "red").then(() => {
                                terminal.printSlow("Enter any key to Retry").then(() => {
                                    terminal.input(" ", () => {
                                        terminal.clear();
                                        terminalInit();

                                    })
                                })
                            });

                        });

                })

            })
        })
    })

}
terminalInit();







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




let printToTerminal = (text, option, color) => {
    if (option == "desc") {
        terminal.clear();
        terminal.print(text);
        terminal.newline();
        terminal.printSlow("What would you do?", "green").then(() => {
            terminal.newline();
            terminal.input(" ", (input) => {
                processInput(input)
            })
        })
    }
    else if (option == "error") {
        terminal.printSlow(text, "red").then(() => {
            terminal.newline();
            terminal.input(" ", (input) => {
                processInput(input)
            })
        })
    }
    else if (option == "inspect") {
        terminal.printSlow(text, "blue").then(() => {
            terminal.newline();
            terminal.input(" ", (input) => {
                processInput(input)
            })
        })
    }
    else {
        terminal.printSlow(text, color).then(() => {
            terminal.newline();
            terminal.input(" ", (input) => {
                processInput(input)
            })
        })
    }


}





let extractInfo = (data) => {
    masterData = data["data"];
    console.log(masterData)
    mainDescription = masterData["content"];
    mainTitle = masterData["misc"]["title"];
    option1Text = masterData["misc"]["left_option"];
    option2Text = masterData["misc"]["right_option"];
    nouns = masterData["misc"]["descriptions"];
    printToTerminal(mainDescription, "desc")
    optionsIntent();
}


let compare = (arr1, arr2) => {
    // console.log(arr1, arr2)
    if (arr1.length != arr2.length) {
        return false;
    }
    let masterFlag = 0;
    if (arr1.length == 1) {
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
    else {
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
        if (masterFlag == (arr1.length)) {
            return true;
        }
        arr1.reverse();
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
        if (masterFlag == (arr1.length)) {
            return true;
        }

        return false;
    }

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
            printToTerminal(`Noun: "${userNouns[i]}" not present in the Env`, "error");
            resetForNewInput();
            return;
        }
    }
    if (compare(userIntent._intent, option1._intent)) {
        console.log("Option 1 choosen")
        chooseOption(0)
        return;
    }
    if (compare(userIntent._intent, option2._intent)) {
        console.log("Option 2 choosen")
        chooseOption(1)
        return;
    }
    if (userIntent._intent[0][0][0] == "inspect") {
        for (let ele in nounDescs) {
            if (ele == userNouns[0]) {
                printToTerminal(nounDescs[ele], "inspect")
            }
        } resetForNewInput();
        return;
    }
    printToTerminal("random user input to be programmed", "error")
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
    // console.log(intent)
    if (intent.length == 0 || intent[0].length == 0) {
        printToTerminal("I can't be wasting time!", "error");
        return false;
    }
    if (userIntent._hasAnd == true) {
        printToTerminal("Gotta take it one action at a time", "error")
        return false;
    }
    if (intent[0][0] == "inspect") {
        if (intent.length != 1) {
            return false;
        }
    }
    return true;
}











let processInput = (input) => {
    userInput = input;
    userIntent = new sentence(userInput);
    console.log("Users Intent: ", userIntent._intent)
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
    else {
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











