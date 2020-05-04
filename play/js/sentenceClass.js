
class sentence {
    constructor(text) {
        this._mainText = text;
        this._Editedtext = nlp(text);
        this._Editedtext.contractions().expand();
        this._Editedtext.toLowerCase();
        this._text = replacer(this._Editedtext);
        this._intent = intentArray(this._text)
        this._hasAnd = hasAnd(this._text);
    }
}


let hasAnd = (text) => {
    let terms = text.terms().out("array")
    for(let i = 0; i < terms.length; i++){
        if(terms[i] == "and"){
            return true;
        }
    }
    return false;
}



let ifIn = (term, list) => {
    for (let i = 0; i < list.length; i++) {
        if (term == list[i]) {
            return true;
        }
    }
    return false;
}
let searchCheck = (terms, i, termsText) => {
    let k = 0;
    termsText.forEach(ele => {
        if (terms[i++] == ele.text) {
            k++;
        }
    })
    if (k == termsText.length) {
        return true;
    }
    else {
        return false;
    }
}

let concat = (terms) => {
    let str = "";
    terms.forEach((ele, i) => {
        str += ele.text;
        if (i != (terms.length - 1)) {
            str += " ";
        }
    })
    return str;
}

let Intenthas = (intent) => {
    let a = 0;
    for (let i = 0; i < intent.length; i++) {
        if (intent[i][1] == "noun") {
            a++;
        }
        if (intent[i][1] == "verb") {
            a++;
        }
    }
    if (a >= 2) {
        return true;
    }
    else {
        return false;
    }
}



/* Sentence Class: End */

function intentArray(text) {
    // console.log(text.termList())
    let terms = text.terms().out("array");
    let nouns = text.nouns().out('array')
    let verbs = text.verbs().out('array')
    let adjs = text.adjectives().out('array');
    let verbsjson = text.verbs().json();
    verbsjson.forEach(ele => {
        if (ele.isNegative) {
            // console.log(ele)
            terms.forEach((elem, i) => {
                if (elem == ele.terms[0].text) {
                    if (searchCheck(terms, i, ele.terms)) {
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
    for (let i = 0; i < terms.length; i++) {
        if (ifIn(terms[i], nouns)) {
            let noun = [terms[i], "noun"];
            /* console.log("noun") */
            intent.push(noun);
        }
        if (ifIn(terms[i], adjs)) {
            let adj = [terms[i], "adj"];
            intent.push(adj)
        }
        if (ifIn(terms[i], verbs)) {
            /* console.log("verb") */
            let verb = [terms[i], "verb"];
            intent.push(verb);
        }
        if (Intenthas(intent)) {
            masterIntent.push(intent)
            intent = [];
        }
    }
    return (masterIntent)
}