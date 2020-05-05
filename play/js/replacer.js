let synonyms = {
    'open': ["go through", 'leave', 'get through', 'twist', "enter"],
    'lay': ["lie down", 'rest'],
    'jump': ["bounce"],
    'pick': ["pick up"],
    '': ["to the"],
    'key': ["the keys", "the key"],
    'with':["using"],

    //inspect verbs
    'inspect': ["describe", "look", "check"],

    //nouns to be replaced

    'knob' : ['door knob'],
    "paper": ["piece of paper", "sheet of paper"]
}


let replacer = (text) => {
    for(let prop in synonyms){
        synonyms[prop].forEach(ele => {
            text.replace(ele, prop);
        });
    }
    return text;
}