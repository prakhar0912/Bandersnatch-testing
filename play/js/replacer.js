let synonyms = {
    'open': ["go through", 'leave', 'get through', 'twist', "enter"],
    'lay': ["lie down", 'rest'],
    'jump': ["bounce"],
    //inspect verbs
    'inspect': ["describe", "look", "check"],

    //nouns to be replaced

    'knob' : ['door knob']
}


let replacer = (text) => {
    for(let prop in synonyms){
        synonyms[prop].forEach(ele => {
            text.replace(ele, prop);
        });
    }
    return text;
}