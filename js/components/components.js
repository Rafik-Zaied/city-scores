//Classe che gestisce gli elementi di input
class InputComponents{
    constructor(){
        this.userInput = document.querySelector("#user-input");
        this.btnSubmit = document.querySelector("#btn-submit");
    }

    //Metodo che rimanda il valore presente nella textbox però in minuscolo, infatti utiliziamo la funzione .toLowerCase()
    //perchè per eseguire la ricerca, il nome della città deve essere in minuscolo, il valore viene passato alla funzione 
    //checkInput() presente in utilities.js, che verifica se il dato sia effetivamente una stringa di testo, in caso contrario, 
    //mandera un errore, il risultato sara appunto il nome della città che andremo ad aggiungere ad un url necessario per il fetch
    //dei dati.
    getInput(){
        return checkInput(this.userInput.value.toLowerCase());
    }

    //Metodo che pulisce il contenuto della texbox
    clearInput(){
        this.userInput.value="";
    }

    //Metodo che aggiunge la funzione func all'evento click
    onClick(func){
        this.btnSubmit.addEventListener("click", func)
    }
}


//Classe che gestisce l'output, ovvero si occupa di aggiungere alla pagina gli elementi generati dalle funzioni al suo interno
//i dati necessari per la creazione degli elementi sono presenti nei parametri cityName e data, passati alla classe al momento della 
//sua inizializzazione, data è un oggetto contenente: un array con due immagini una formato web e una formato mobile, la descrizione 
//della città, un array contenente oggetti che a loro volta contengono la categoria e il punteggio relativa alla categoria e in fine 
//il punteggio totale della città, questo oggetto data viene generato dalla funzione createCityData() presente nella pagina utilities.js
class OutputComponents{
    constructor(cityName, data){
        this.displayScore = document.querySelector("#display-score");
        this.cityName = cityName;
        this.cityData = data;
    }
    
    //Metodo che elimina tutti gli elementi presenti nella sezione di output, la useremo per cancellare i dati precedentemente
    //caricati, in modo che nel momento di una seconda ricerca, i dati non vadano a generarsi in seguito ai quelli della ricerca
    //precedente
    clearOutput(){
        this.displayScore.innerHTML="";
    }


    appendTitle(){
        let title = document.createElement("h2");
        title.innerHTML = this.cityName.toUpperCase();
        this.displayScore.append(title);
        title.classList.add("my-4");
    }

    //Metodo che crea gli elementi immagine, attribuisce tramite il ciclo for each a ciascun elemento il valore corrispondente, 
    //aggiunge un id ad entrambi che utilizzeremo per definire lo stile, e infine aggiunge gli elementi alla pagina
    appendImages(){
        let imgWeb = document.createElement("img");
        let imgMobile = document.createElement("img");

        this.cityData.images.forEach(elem => {
            if (elem.includes("web")) {
                imgWeb.src = elem;
            }
            else imgMobile.src = elem;
        });
        
        imgWeb.setAttribute("id", "img-web");
        imgMobile.setAttribute("id", "img-mobile");
        this.displayScore.append(imgWeb);
        this.displayScore.append(imgMobile);
        imgWeb.classList.add("w-100", "my-4");
        imgMobile.classList.add("w-75", "my-4");
    }

    //Metodo che crea un elemento div al quale aggiungiamo direttamente il testo presente dentro data.summary, perche il testo ha gia 
    //i tag <p>, poi aggiungiamo alla pagina il div contenente il testo
    appendSummary(){
        let summary = document.createElement("div");
        summary.innerHTML = `${this.cityData.summary}`;
        this.displayScore.append(summary);
        summary.classList.add("text-center", "mt-4");
    }

    //Metodo che crea un div che andrà a contenere un titolo per la sezione e la lista delle categorie, creiamo il titolo e l'elemento 
    //ul che conterra gli elementi della lista 'li' che aggiungeremo tramite il ciclo for each
    appendCategories(){
        let categoriesDiv = document.createElement("div");
        let categoriesTitle = document.createElement("h3");
        categoriesTitle.innerHTML="Categories:"
        let categories = document.createElement("ul");
        this.displayScore.append(categoriesDiv);
        categoriesDiv.append(categoriesTitle);
        categoriesDiv.append(categories);

        this.cityData.categories.forEach(obj => {
            let li = document.createElement("li");
            li.innerHTML=`${obj.name}: ${(obj.score_out_of_10).toFixed(2)}/10`;
            categories.appendChild(li);
        });

        categoriesDiv.classList.add("my-4");
        categoriesTitle.classList.add("text-center");
    }

    //Metodo che crea l"elemento che conterrà lo score della città e lo aggiunge a schermo
    appendCityScore(){
        let cityScore = document.createElement("h2");
        cityScore.innerHTML = (this.cityData.cityScore).toFixed(2);
        this.displayScore.append(cityScore);
        cityScore.classList.add("my-4", "text-center");
    }

    //Metodo che chiama tutte i metodi precedenti necessari all'output dei dati scaricati
    printData(){
        this.clearOutput();
        this.appendTitle();
        this.appendImages();
        this.appendSummary();
        this.appendCategories();
        this.appendCityScore();
    }

    clearOutput(){
        this.displayScore.innerHTML = " "
    }
}