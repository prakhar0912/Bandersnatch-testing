let text = "alkdsfj";
nlp.extend((text, world) =>{
    world.addWords({
        'death note': 'Noun',
        'open': 'Verb',
        'fucking': 'Adjective',
        'get through': 'Verb',
        'joker card': 'Noun', 
        'inspect': "Verb"
    });
})