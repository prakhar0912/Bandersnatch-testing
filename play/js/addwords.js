let text = "alkdsfj";
nlp.extend((text, world) =>{
    world.addWords({
        'is': "Pronoun",
        'death note': 'Noun',
        'fucking': 'Adjective',
        'get through': 'Verb',
        'joker card': 'Noun', 
        'inspect': "Verb",
        'doorknob': 'Noun',
        'insert': 'Verb',
        'open':"Verb",
        'using': "Verb",
        'with': "Verb",
        'north': "Adjective",
        'do not': "Adverb"
    });
})