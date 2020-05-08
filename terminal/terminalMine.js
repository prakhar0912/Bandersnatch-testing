
async function input() {
    return new Promise(resolve => {
        const onKeyDown = event => {
            if (event.keyCode === 13) {
                event.preventDefault();
                let result = event.target.textContent;
                input.classList.remove("active")
                resolve(result);
            }
        };

        let terminal = document.querySelector(".terminal");
        let input = document.createElement("div");
        input.classList.add("active");
        input.setAttribute("id", "input");
        input.setAttribute("contenteditable", true);
        input.setAttribute("spellcheck", false);
        input.addEventListener("keydown", onKeyDown);
        terminal.appendChild(input);
        input.focus();
    });
}






function pause(s = 1) {
    return new Promise(resolve => setTimeout(resolve, 1000 * Number(s)));
}


async function type(text) {
    let container = document.querySelector(".terminal");
    let queue = text.split("");
    let typer = document.createElement("div");
    typer.classList = "typer active";
    container.appendChild(typer);
    while (queue.length) {
        let char = document.createElement("span");
        char.classList.add("char")
        char.innerHTML = queue.shift();
        typer.appendChild(char);
        window.scrollTo(0, document.body.scrollHeight);

        await pause(0.02);
    }
    if (text.length == 1) {
        await pause(1.00);
    }
    typer.classList.remove("active");
    return;
}


function clear() {
    document.querySelector(".terminal").innerHTML = "";
}


function newline() {
    let br = document.createElement("br");
    document.querySelector('.terminal').appendChild(br);
}