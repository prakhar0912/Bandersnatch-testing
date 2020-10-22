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
let api = "http://localhost:1729/api"


let key = document.querySelector(".switch");
let crt = document.querySelector("#crt");
let crtContainer = document.querySelector(".crt-container");
let termi = document.querySelector(".terminal-inner");
let shadow = document.querySelector(".shadow")
let onOrOff = 0;

let toggle = () => {
    key.removeEventListener("click", toggle);
    key.classList.toggle("off");
    crt.classList.toggle("turned-off")
    change = true;
    onOrOff++;
    setTimeout(() => {
        crt.classList.toggle("turned-on");
        shadow.classList.toggle("shadow-on")
        change = false;
        termi.innerHTML = "";
        setTimeout(() => {
            if (onOrOff % 2 == 1) {
                terminalInit();
            }
            key.addEventListener("click", toggle);
        }, 900);
    }, 400)
}


key.addEventListener("click", toggle)






let terminalInit = async () => {
    clear();
    await type(". . . . . . . .", 0.05);
    await type(". .", 0.05);
    clear();

    termi.innerHTML = `<div class="container"><h2 class="game-title">Continuum</h2><div class="button" onclick="login()">Login</div><div class="button" onclick="signup()">Sign-up</div></div>`

    //     termi.innerHTML = `<div class="container"><h2 class="game-title">
    //  _____ ______ _   _ _____ _____ _   _ _   _ _   ____  ___
    //  /  __ \\  __  | \ | |_   _|_   _| \ | | | | | | | |  \/  |
    //  | /  \\/ |  | |  \| | | |   | | |  \| | | | | | | | .  . |
    //  | |   | |  | |     | | |   | | |     | | | | | | | |\/| |
    //  | \\__/\\ \__/ / |\  | | |  _| |_| |\  | |_| | |_| | |  | |
    //   \\____/\\____/\_| \_/ \_/  \___/\_| \_/\___/ \___/\_|  |_/
    //     </h2></div>`;


    // await type('  _____ ______ _   _ _____ _____ _   _ _   _ _   ____  ___', 0.01, "title")
    // await type(' /  __ \  __  | \ | |_   _|_   _| \ | | | | | | | |  \/  |', 0.01, "title")
    // await type(' | /  \/ |  | |  \| | | |   | | |  \| | | | | | | | .  . |', 0.01, "title")
    // await type(' | |   | |  | |     | | |   | | |     | | | | | | | |\/| |', 0.01, "title")
    // await type(' | \__/\ \__/ / |\  | | |  _| |_| |\  | |_| | |_| | |  | |', 0.01, "title")
    // await type('  \____/\____/\_| \_/ \_/  \___/\_| \_/\___/ \___/\_|  |_/', 0.01, "title")
    // document.querySelector(".container").innerHTML += `<div class="button" onclick="login()">Login</div><div class="button" onclick="signup()">Sign-up</div>`;
}





let gameInit = async () => {
    document.querySelector('.inputs').classList.remove('show');
    clear();
    await type(". . . . . . . .", 0.1);
    await type(". . . . .", 0.1);
    clear();
    termi.innerHTML = '<div class="container"><h1 class="game-title">Continuum</h1><div class="button" onclick = "play()">New Game</div><div class="button">Load Game</div><div class="button">Options</div></div>';
}





let login = async () => {
    clear();

    let email = "";
    let pass;
    document.querySelector('.inputs').classList.add('show');
    await type("Login to play Bandersnatch!");
    await type("Email:");
    await input().then((res) => {
        email = res;
    })
    await type("Password:");
    await input("password").then((res) => {
        pass = res;
    })
    let loading = setInterval(async () => {
        await type(". ")
    }, 500);
    email = email.toLowerCase();
    pass = pass.toLowerCase();
    console.log(email, pass);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({ "email": email, "password": pass });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(api + "/bandersnatch/signin", requestOptions)
        .then(response => response.json())
        .then(async (result) => {
            console.log(result)
            sessionStorage.setItem("auth_key", result["token"])
            console.log(sessionStorage.getItem("auth_key"))
            clearInterval(loading)

            if (result.token) {
                await type("Welcome back!");
                await type("Enter any key to continue:")
                await input().then(() => {
                    gameInit();
                })
            }
            else {
                await type("Error!");
                await type("Enter any key to retry:");
                await input().then(() => {
                    clear();
                    login();
                })
            }
        })
        .catch(async (error) => {
            clearInterval(loading)

            console.log('error', error)
            await type("Error!");
            await type("Enter any key to retry:");
            await input().then(() => {
                clear();
                login();
            })
        });

}
// terminalInit();





let play = () => {
    document.querySelector('.inputs').classList.add('show');
    clear();
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

    fetch(api + "/bandersnatch/play", requestOptions)
        .then(response => response.json())
        .then(result => {
            extractInfo(result);
        })
        .catch(error => console.log('error', error));
}

let hintDiv = document.querySelector('.hint')
let removeHint = () => {
    document.querySelector('.terminal').removeEventListener('click', removeHint);
    hintDiv.classList.remove('show-hint')
}


let renderHint = (data) => {
    hintDiv.innerHTML = data;
    hintDiv.classList.add('show-hint')
    document.querySelector('.terminal').addEventListener('click', removeHint);
}


let getHint = () => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", sessionStorage.getItem('auth_key'));
    let ok = true;
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(api + "/bandersnatch/hint", requestOptions)
        .then(response => {
            if (!response.ok) {
                ok = false
            }
            return response.json()
        })
        .then(result => {
            if (!ok) {
                throw result
            }
            console.log(result)
            renderHint(result["hint"])
        })
        .catch(error => {
            console.log('error', error)
            renderHint(error["msg"])
        });
}



document.querySelector('.hint-icon').addEventListener('click', getHint);

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

    fetch(api + "/bandersnatch/play", requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            resetVariables();
            extractInfo(result);
        })
        .catch(error => console.log('error', error));
}
// play();






let optionsIntent = () => {
    option1 = new sentence(option1Text)
    console.log("Option 1 Intent: ", option1._intent);
    option2 = new sentence(option2Text)
    console.log("Option 2 Intent: ", option2._intent)
    options = [option1, option2];
}




let printToTerminal = async (text, option) => {

    if (option == "desc") {
        await newline();
        await type(text);
        await newline();
        if (option1Text != "all") {
            await type("What would you do?");
        }
        else {
            await type("Enter any key to continue...");
        }
        await newline();
        input().then((input) => {
            processInput(input);
        })

    }
    else {
        await type(text);
        await newline();
        await input().then((res) => {
            processInput(res);
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
}






let validateInput = (intent) => {
    // console.log(intent)
    if (intent.length == 0 || intent[0].length == 0) {
        printToTerminal("I can't be wasting time!(Use a verb to guide your character)", "error");
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




let nonStory = (content) => {
    console.log(content);
    printToTerminal(content["data"]["content"]);

}









let processInput = (input) => {
    userInput = input;
    if (option1Text == "all") {
        chooseOption(0);
        return;
    }
    if (option2Text == "all") {
        chooseOption(1);
        return;
    }
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
    // var myHeaders = new Headers();
    // myHeaders.append("Content-Type", "application/json");
    // myHeaders.append("Authorization", sessionStorage.getItem("auth_key"));

    // var raw = JSON.stringify({ "left_option": option1Text, "right_option": option2Text, "user_input": userInput });

    // var requestOptions = {
    //     method: 'POST',
    //     headers: myHeaders,
    //     body: raw,
    //     redirect: 'follow'
    // };

    // fetch("https://modelscenario.dscvit.com/", requestOptions)
    //     .then(response => response.json())
    //     .then(result => {
    //         console.log(result);
    //         resetVariables();
    //         resetForNewInput();
    //         if (!result["artifacts"]) {
    //             console.log("non-story progressing node")
    //             nonStory(result);
    //         }
    //         else {
    //             extractInfo(result);
    //         }

    //     })
    //     .catch(error => console.log('error', error));
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



let signup = async () => {
    clear();

    let email = "";
    let pass;
    let name;
    document.querySelector('.inputs').classList.add('show');
    await type("Sign Up to play Bandersnatch!");
    await type("Name:");
    await input().then((res) => {
        name = res;
    })
    await type("Email:");
    await input().then((res) => {
        email = res;
    })
    await type("Password:");
    await input().then((res) => {
        pass = res;
    })
    let loading = setInterval(async () => {
        await type(". ")
    }, 500);
    email = email.toLowerCase();
    pass = pass.toLowerCase();
    name = name.toLowerCase();
    console.log(email, pass, name);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let final = {};

    var raw = JSON.stringify({ "name": name, "email": email, "password": pass });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(api + "/bandersnatch/signup", requestOptions)
        .then(response => response.json())
        .then(async (result) => {
            console.log(result);
            final = result;
            clearInterval(loading);
            if (result["token"]) {
                await type("Signup successful! Press any key to continue");
                await input().then(() => {
                    clear();
                    terminalInit();
                })
            }
            else {
                await type(`${result["msg"]}, please enter a key to try again.`);
                await input().then(() => {
                    clear();
                    terminalInit();
                })
            }


        })
        .catch(async (error) => {
            console.log('error', error)
            clearInterval(loading);
            await type("There was an error in processing that request, please enter a key to try again.");
            await input().then(() => {
                clear();
                terminalInit();
            })


        });
}







