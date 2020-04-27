let synonyms = {
    'open': ["go through", 'enter', 'leave', 'get through', 'twist'],
    'lay': ["lie down", 'rest'],
    'jump': ["bounce"]
}

let replacer = (verbs) => {
    let i = 0;
    for (let verb of verbs) {
        let str;
        for (let prop in synonyms) {
            let l = nlp(verb.text).lookup(synonyms[prop]).out('string');
            if(l){
                str = verb.text;
                str = str.replace(l, prop)
                str = nlp(str).verbs().json();
                verbs.splice(i, 1, str[0])
            }
        }
        if (i == (verbs.length - 1)) {
            return verbs;
        }
        i++;
    }

}