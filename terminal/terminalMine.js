let change = false;
async function input(option) {
    return new Promise(resolve => {
        const onKeyDown = event => {
            if (event.keyCode == 37 || event.keyCode == 39) {
                event.preventDefault();
            }
            if (event.keyCode === 13) {
                event.preventDefault();
                let result = event.target.textContent;
                input.classList.remove("active")
                input.removeAttribute("contenteditable");
                resolve(result);
            }
        };
        let inputDiv = document.querySelector(".insert-here")
        inputDiv.innerHTML = ""
        let terminal = document.querySelector(".terminal-inner");
        let input = document.createElement("div");
        input.classList.add("active");
        input.setAttribute("id", "input");
        input.setAttribute("contenteditable", true);
        input.setAttribute("spellcheck", false);
        input.addEventListener("keydown", onKeyDown);
        if (option == "password") {
            input.classList.add("password");
        }
        inputDiv.appendChild(input);
        terminal.scrollTop = terminal.scrollHeight;
        input.focus();
    });
}









function pause(s = 1) {
    return new Promise(resolve => setTimeout(resolve, 1000 * Number(s)));
}


async function type(text, speed, special = "none") {
    let container;
    if (special == "none") {
        container = document.querySelector(".terminal-inner");
    }
    if (special == "title") {
        container = document.querySelector(".game-title");
    }
    let queue = text.split("");
    let typer = document.createElement("div");
    typer.classList = "typer active";
    container.appendChild(typer);
    while (queue.length) {
        let char = document.createElement("span");
        char.classList.add("char")
        char.innerHTML = queue.shift();
        typer.appendChild(char);

        container.scrollTop = container.scrollHeight;
        if (change == true) {
            return;
        }
        if (speed) {
            await pause(speed);
        }
        else {
            await pause(0.01);
        }
    }
    if (text.length == 1) {
        await pause(1.00);
    }
    typer.classList.remove("active");
    return;
}


function clear() {
    document.querySelector(".terminal-inner").innerHTML = "";
}




let term = document.querySelector(".terminal-inner");
let bezel = document.querySelector(".bezel");

let inputFocus = () => {
    let active = document.querySelector(".active")
    if (document.querySelector(".shadow-on") != null) {
        if (active.id == "input") {
            active.focus();
        }
    }

}

term.addEventListener("click", inputFocus);



async function newline() {
    let br = document.createElement("br");
    document.querySelector('.terminal-inner').appendChild(br);
    term.scrollTop = term.scrollHeight;
}



document.addEventListener("keydown", (e) => {
    if (e.keyCode == 38) {
        term.scrollBy(0, -50);
    }
    if (e.keyCode == 40) {
        term.scrollBy(0, 50);
    }
})