let synonyms = {
    'open': ["go through", 'leave', 'get through', 'twist'],
    'lay': ["lie down", 'rest'],
    'jump': ["bounce"],
    'doorknob': ["door knob"]
}




let replacer = (text) => {
    for(let prop in synonyms){
        synonyms[prop].forEach(ele => {
            text.replace(ele, prop);
        });
    }
    return text;
}