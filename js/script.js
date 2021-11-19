//inizializziamo prima le classi InputComponents e ErrorHandler paramentri della funzione run() che ci serviranno per leggere 
//il dato inserito dall'utente e per segnalare un eventuale errore.
const inputComponents = new InputComponents();
const errorHandler = new ErrorHandler();

const run = (inputComponents, errorHandler) => {
    //assegnamo all'evento run la seguente funzione
    inputComponents.onClick(async function(){
        try {
            //puliamo il testo della ErrorBox, così che nel caso l'esecuzione sia corretta, non ci resta la segnalazione di un errore
            //sorto nella precedente esecuzione
            errorHandler.clearErrorBox();
            
            //salviamo l'input dell'utente, verificato e pronto all'uso
            userInput = inputComponents.getInput();
            //Passiamo l'input alla funzione createCityData, che a sua volta lo passerà alle funzione che si occupano di scaricare
            //i dati e le immagini, createCityData unira poi i due elementi generati li salverà in data.
            data = await createCityData(userInput);

            //inizializziamo la classe OutputComponents con l'input del utente, ovvero il nome della città e data, un oggetto
            //contenente tutti i dati da stampare in pagina 
            const outputComponents = new OutputComponents(userInput, data);
            //utiliziamo il metodo printData() che a sua volta eseguira a cascata tutti i metodi presenti al suo interno, responsabili
            //della creazione degli elementi, e della aggiunta di quest'ultimi alla pagina.
            outputComponents.printData();
    
        } catch (error) {
            //nei vari metodi e funzioni eseguiti all'interno del try{} vengono lanciati degli errori
            //"input" nel caso l'errore sia relativo al dato inserito dall'utente
            //"fetch" nel caso l'errore sia relativo all'acquisizione dei dati
            //nel caso di un errore e in base al messagio dell'errore stampiamo nella errorbox il messaggio corrispondente.
            if (error.message == "input") {
                errorHandler.setInputError();
            } else if (error.message == "fetch") {
                errorHandler.setFetchError();
            }
        }
    });
    
}

run(inputComponents, errorHandler);