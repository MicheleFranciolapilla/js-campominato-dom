# CAMPO MINATO (Completamento) #

### Esercizio basato sulla manipolazione del DOM ###

#### Consegne per il programma: ####
**Generare 16 numeri casuali ed occupare le relative celle con delle bombe. Quando l'utente clicca su una cella, cambiarne la colorazione se non minata oppure concludere la partita se la cella è minata. Terminare il gioco quando l'utente clicca sull'ultima cella non minata, senza aver cliccato su alcuna cella minata.**
**BONUS: dare la possibilità all'utente di scegliere una griglia di gioco a 49 (7X7), 81(9X9) o 100(10X10) celle.**

---

### Programma realizzato: ###

**Il programma è stato implementato nel seguente modo:**

- #### Header e Navbar: ####
    *La sezione header include 3 elementi: logo a sinistra, timer al centro, navbar a destra.*
    *La navbar si compone di 2 select e del pulsante "Play".*
    ***La prima select*** *consente di selezionare la griglia di gioco (numero di celle totali) ed offre 3 opzioni:*
        *- 49 celle (7 X 7)*
        *- 81 celle (9 X 9)*
        *- 100 celle (10 X 10)*
    ***La seconda select*** *consente la selezione del livello di difficoltà, anch'esso con 3 opzioni:*
        *- Facile (10% di celle minate)*
        *- Medio (25% di celle minate)*
        *- Difficile (50% di celle minate)*
    ***Il pulsante "Play"*** *conduce al gioco*
    ***Tutti gli elementi della navbar vengono disattivati ad inizio gioco e riattivati al termine di esso (per vittoria, sconfitta o abbandono); essi restano inoltre inaccessibili (disattivati) durante la visualizzazione dei messaggi all'utente ed ogni volta che risulti attiva l'area "extra"***

- #### Area "extra": ####
    *L'area "extra" è collocata alla sinistra della griglia di gioco ed è mantenuta costantemente invisibile, salvo nei casi in cui vi sia il click su determinati pulsanti del menù di supporto; in tali casi essa funge da contenitore in cui dare seguito alle operazioni innescate dallo specifico elemento del menù di supporto.*

- #### Menù di supporto: ####
    *Il menù di supporto è collocato superiormente, alla sinistra della griglia di gioco. Esso presenta un numero di pulsanti variabile (da 2 a 4) a seconda della fase del programma (gioco avviato o meno). Il dettaglio dei pulsanti è il seguente:*
        ***- pulsante "informazioni" (sempre presente)*** *che apre una finestra scrollabile entro cui vengono spiegate le regole del gioco.*  
        ***- pulsante "aiuto" (presente solo nelle fasi di gioco)*** *il quale da all'utente la possibilità di vedere la disposizione delle celle minate all'interno della griglia di gioco. Ad ogni utilizzo dell'aiuto viene incrementata una specifica variabile di penalizzazione tale che, a fine partita e in caso di vittoria, il punteggio conseguito viene ridotto proporzionalmente al numero di aiuti ricevuti ed al livello di difficoltà del gioco (minore il livello di difficoltà, maggiore sarà il peso della penalità).*
        ***- pulsante "abbandono" (presente solo nelle fasi di gioco)*** *che consente di chiudere immediatamente la partita in corso.*
        ***- pulsante "vittorie" (sempre presente)*** *che visualizza un elenco (eventualmente scrollabile o anche vuoto) con i dati di tutte le partite concluse e vinte nella sessione in corso. Le partite sono ordinate dall'ultima alla prima (LIFO).*

- #### Infobar laterale: ####
    *Ad inizio partita viene attivata anche una infobar (a destra della griglia di gioco) dentro cui sono visualizati i dati (dinamici e statici) della partita in corso.*
    *I dati sono i seguenti:*
        ***- Punti (dinamico):*** *mostra il punteggio aggiornato in tempo reale.*
        ***- Penalità (dinamico):*** *mostra il numero di volte in cui si è fatto ricorso all'aiuto.*
        ***- Celle (statico):*** *visualizza il numero di celle totali con cui si sta giocando.*
        ***- Bombe (statico):*** *visualizza il numero di bombe totali presenti nella griglia di gioco.*
        ***- Marcature (dinamico):*** *si tratta di un contatore che mostra il numero di celle marcate come* ***potenzialmente minate***. *L'utente può marcare le celle che ritiene "a rischio" facendo click con il tasto destro del mouse; ogni marcatura può anche essere rimossa, rifacendo click destro. Le celle marcate sono al sicuro dai click (accidentali o voluti) con tasto sinistro fintantochè restano marcate.*

- #### Gioco: ####
    *Il gioco si svolge all'interno della griglia, posizionata al centro del monitor.*
    *Si è scelto di riprodurre il gioco originale, in cui ciascuna cella, una volta cliccata con il tasto sinistro del mouse,scopre il suo contenuto che può essere di 3 tipi:*
        ***- Bomba:*** *concludendo la partita con la sconfitta dell'utente e la visualizzazione di una immagine ".gif" e del relativo messaggio.*
        ***- Numerico:*** *in cui il numero indica la quantità di celle minate confinanti con la cella correttamente cliccata.*
        ***- Vuoto:*** *il che indica che la cella cliccata non confina con alcuna cella minata e di conseguenza parte una espansione "centrifuga" di celle cliccate (con tanto di aggiornamento delle informazioni dinamiche) che si conclude sui bordi, al confine con celle minate o, in casi particolarmente fortunati direttamente con la vittoria.*

- #### Tempo di gioco: ####
    *Ad ogni inizio partita si avvia un timer che consente di registrare, in caso di esito favorevole, anche il tempo totale di gioco.*

- #### Vittoria: ####
    *Alla conclusione del gioco con vittoria, viene aperta una finestra (nell'area extra) in cui sono visualizzati tutti i dati della partita e si chiede all'utente di inserire il proprio nome o id. Tali informazioni verranno registrate in appositi array, e saranno poi visualizzabili nella "lista delle vittorie della sessione in corso".*

---

**Il progetto si compone, fondamentalmente dei seguenti files:**
    ***- index.html*** *in cui sono presenti gli elementi essenziali del DOM*
    ***- style.css*** *nel quale vengono definiti gli stili del progetto ed anche le dimensioni di griglia e celle (eventualmente modificabili attraverso specifica variabile)*
    ***- reset_and_utilities.css*** *che è un file di stile in cui sono sviluppate una serie di classi di utilità.*  
    ***Per questo progetto si è preferito non utilizzare Bootstrap (anche se avrebbe reso le cose più semplici) per non perdere l'abitudine all'utilizzo del CSS classico.***
    ***- main.js*** *nel quale è sviluppata tutta la logica del progetto, articolata tra un buon numero di variabili e costanti globali e funzioni che assolvono specifiche attività*

---
---
---



