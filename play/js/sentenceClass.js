
class sentence {
    constructor(text) {
        this._mainText = text;
        this._text = nlp(text);
        this._text.contractions().expand();
        this._text.toLowerCase();
        this._text = replacer(this._text);
        this._finalText = this._text.verbs().toInfinitive().all().text();
        this._finalText = nlp(this._finalText)
        this._splitAtVerbs = this._finalText.splitBefore("#Verb").out("array");
        this._intent = intentArray(this._splitAtVerbs)
        this._hasAnd = hasAnd(this._finalText);

    }
}



let hasAnd = (text) => {
    let terms = text.terms().out("array")
    for (let i = 0; i < terms.length; i++) {
        if (terms[i] == "and") {
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
    // let verbsjson = text.verbs().json();
    // verbsjson.forEach(ele => {
    //     text.replace(ele.text, nlp(ele.text).verbs().toInfinitive());
    // })
    //console.log(text.out("string"))
    // let terms = text.terms().out("array");
    // let nouns = text.nouns().out('array');
    // let verbs = text.verbs().out('array')
    // let adjs = text.adjectives().out('array');

    // verbsjson.forEach(ele => {
    //     if (ele.isNegative) {
    //         // console.log(ele)
    //         terms.forEach((elem, i) => {
    //             if (elem == ele.terms[0].text) {
    //                 if (searchCheck(terms, i, ele.terms)) {
    //                     terms.splice(i, ele.terms.length, concat(ele.terms));
    //                 }
    //             }
    //         })
    //     }

    // });
    // console.log(terms)
    // console.log(nouns, verbs, adjs)
    // let intent = [];
    // let masterIntent = [];
    // let nounAdded = -1;
    // let verbAdded = false;

    // for (let i = 0; i < terms.length + 1; i++) {
    //     if (Intenthas(intent) && adjs.length == 0) {
    //         console.log(i)
    //         masterIntent.push(intent)
    //         intent = [];
    //         nounAdded = -1;
    //         verbAdded = false;
    //     }
    //     if (ifIn(terms[i], nouns)) {
    //         let noun = [terms[i], "noun"];
    //         /* console.log("noun") */
    //         intent.push(noun);
    //         nounAdded = intent.length;
    //     }
    //     if (ifIn(terms[i], adjs)) {
    //         if (nounAdded != -1) {
    //             intent.splice(nounAdded - 1, 0, [terms[i], "adj"])
    //             adjs.pop();
    //         }
    //         else {
    //             let adj = [terms[i], "adj"];
    //             intent.push(adj)
    //             adjs.pop();
    //         }
    //     }
    //     if (ifIn(terms[i], verbs)) {
    //         /* console.log("verb") */
    //         if (verbAdded == false) {
    //             let verb = [terms[i], "verb"];
    //             intent.push(verb);
    //             verbAdded = true;
    //         }
    //     }

    // }

    //return (masterIntent)
    masterIntent = [];
    for(let i = 0; i < text.length; i++){
        console.log(text[i])
        let intent = [];
        let nlpText = nlp(text[i]);
        let verb = nlpText.verbs().json();
        let noun = nlpText.nouns().json();
        let adj = nlpText.nouns().adjectives().json();
        console.log(verb, noun, adj);
        intent.push([verb[0].text, "verb"]);
        if(adj.length != 0){
            intent.push([adj[0].text, "adj"]);
        }
        intent.push([noun[0].text, "noun"]);
        masterIntent.push(intent);
    }
    return masterIntent;
}

