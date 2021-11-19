
//Funzione che controlla che il dato inserito dall'utente sia valido per la ricerca, viene utilizzata all'interno del metodo get nella 
//classe InputComponents
function checkInput(userInput){
    if (userInput==" " || userInput=="") {
        
        throw new Error("input");
    }
    
    return userInput;
}


//Funzione che ha come parametro userInput l'input dell'utente gia verificato e pronto per l'uso, il paramentro viene aggiunto ad un 
//url, che utilizzerà per scaricare i dati relativi alla città, che salveremo in data. Da data cancelliamo ciò che non ci è necessario
//e in fine "ritorniamo" data, che verra salvato in una variabile.
async function getData(userInput){
    let url = new URL(`https://api.teleport.org/api/urban_areas/slug:${userInput}/scores/`);
    let response = await fetch(url);
    let data = await response.json();

    delete data._links;

    data.categories.forEach(obj => {
        delete obj.color;
    });

    return data;
    
}

//Funzione che ha come parametro userInput l'input dell'utente gia verificato e pronto per l'uso, il paramentro viene aggiunto ad un 
//url, che utilizzerà per scaricare le immagini della città, che salveremo in photo. Da photo estraiamo solamente le immagini che ci 
//servono che poi aggiungeremo ad un array che "ritorneremo"
async function getPhoto(userInput){
    let url = new URL(`https://api.teleport.org/api/urban_areas/slug:${userInput}/images/`);
    let response = await fetch(url);
    let photo = await response.json();

    mobilePhoto = photo.photos[0].image.mobile;
    webPhoto = photo.photos[0].image.web;

    let photos = [mobilePhoto, webPhoto];

    return photos;

}

//Funzione che ha come parametro userInput, perchè necessario alle due funzione che evoca, le funzione che scaricano i dati e le
//foto della città, i dati vengono salvati in due variabili e poi copiamo le foto presenti nella variabile photo all'interno di data,
//in modo che tutti i dati necessario siano presenti in un unico oggetto, inoltre cambiamo il nome di una chiave del oggetto data per 
//comodità, in fine "ritorniamo" l'oggetto data. Il tutto è all'interno di un try, così che nel casa qualcosa vada storto possiamo 
//mandare un errore.
async function createCityData(userInput){
    try {
        let photo = await getPhoto(userInput);
        let data = await getData(userInput);

        data.images = photo;
        data.cityScore = data.teleport_city_score;
        
        return data;
    } catch (error) {
        throw new Error("fetch");
    }
}

//Classe che gestisce l'errorBox, un elemento <p> che ci comunicherà evenutali errori.
class ErrorHandler{
    constructor(){
        this.errorBox = document.querySelector("#error-box")
    }
    
    setInputError(){
        this.errorBox.innerHTML="Type the name of a city, then press search! For example: Rome, Milan, Los-Angeles."
    }

    setFetchError(){
        this.errorBox.innerHTML="Couldn't find a city to match the search! be sure that the name of the city is typed correctly."
    }

    clearErrorBox(){
        this.errorBox.innerHTML=""
    }
}
