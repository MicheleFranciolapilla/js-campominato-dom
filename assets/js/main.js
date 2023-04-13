// Consegna
// Copiamo la griglia fatta ieri nella nuova repo e aggiungiamo la logica del gioco (attenzione: non bisogna copiare tutta la cartella dell'esercizio ma solo l'index.html, e le cartelle js/ css/ con i relativi script e fogli di stile, per evitare problemi con l'inizializzazione di git).
// Il computer deve generare 16 numeri casuali nello stesso range della difficoltà prescelta: le bombe. Attenzione: nella stessa cella può essere posizionata al massimo una bomba, perciò nell’array delle bombe non potranno esserci due numeri uguali.
// In seguito l'utente clicca su una cella: se il numero è presente nella lista dei numeri generati - abbiamo calpestato una bomba - la cella si colora di rosso e la partita termina. Altrimenti la cella cliccata si colora di azzurro e l'utente può continuare a cliccare sulle altre celle.
// La partita termina quando il giocatore clicca su una bomba o quando raggiunge il numero massimo possibile di numeri consentiti (ovvero quando ha rivelato tutte le celle che non sono bombe).
// Al termine della partita il software deve comunicare il punteggio, cioè il numero di volte che l’utente ha cliccato su una cella che non era una bomba.
// BONUS:
// Aggiungere una select accanto al bottone di generazione, che fornisca una scelta tra tre diversi livelli di difficoltà:
// - difficoltà 1 ⇒ 100 caselle, con un numero compreso tra 1 e 100, divise in 10 caselle per 10 righe;
// - difficoltà 2 ⇒ 81 caselle, con un numero compreso tra 1 e 81, divise in 9 caselle per 9 righe;
// - difficoltà 3 ⇒ 49 caselle, con un numero compreso tra 1 e 49, divise in 7 caselle per 7 righe;
// Consigli del giorno: :party_wizard:
// Scriviamo prima cosa vogliamo fare passo passo in italiano, dividiamo il lavoro in micro problemi.
// Ad esempio:
// Di cosa ho bisogno per generare i numeri?
// Proviamo sempre prima con dei console.log() per capire se stiamo ricevendo i dati giusti.
// Le validazioni e i controlli possiamo farli anche in un secondo momento.



// COSTANTI E VARIABILI GLOBALI
// ******************************

// Sezione relativa al numero di righe:
// Costanti semantiche indicanti il numero di righe selezionato
const   rows_10                 = 10;       //valore di default
const   rows_9                  = 9;
const   rows_7                  = 7;
// Variabile indicante il numero di righe selezionato
let     rows_nr                 = rows_10;

// Sezione relativa alla quantità di bombe presenti nel gioco (livello di difficoltà):
// Costanti semantiche, di tipo stringa, indicanti la percentuale di bombe presenti nel gioco (livello di difficoltà)
const   bombs_easy              = "10%";    //valore di default
const   bombs_medium            = "25%";
const   bombs_hard              = "50%";
const   level_easy              = "Bassa";    //valore di default
const   level_medium            = "Media";
const   level_hard              = "Alta";
// Variabili (stringa e numerica) indicanti il numero di bombe presenti nel gioco (livello di difficoltà)
let     bombs_str               = bombs_easy;   
let     level_str               = level_easy; 
let     bombs_number            = 0;  
// Immagine ".gif" utilizzata alla conclusione del gioco dovuta a click su cella minata
const   explosion_gif           = "https://media.tenor.com/-g-Um3DDvV0AAAAM/explosion.gif"; 
// Icone Font Awesome usate all'occorrenza, per pulsanti menù e celle minate
const   bomb_fa_icon            = '<i class="fa-solid fa-bomb fa-beat fa-2xl" style="color: #ff0000;"></i>';
const   stop_fa_icon            = '<i class="fa-solid fa-xmark"></i>'; 

// Sezione relativa al conta-tempo
// Stringa di output del tempo
let     time_str                = "";
// Variabile numerica indicante i secondi totali di gioco
let     time_num                = 0;
// Variabili numeriche incrementali indicanti ore, minuti e secondi
let     hours                   = 0;
let     minutes                 = 0;
let     seconds                 = 0;   
// Variabile associata alla funzione setInterval
let     timer; 
// Variabile associata all'elemento DOM corrispondente alla visualizzazione del tempo
let     time_info_element       = document.getElementById("time_info");

// Sezione relativa alle costanti semantiche utilizzate nella visualizzazione/occultamento degli elementi laterali
const   side_bars_show          = true; 
const   side_bars_hide          = false; 

// Sezione variabili e costanti specifiche
// Variabile punteggio
let     score                   = 0; 
// Variabile penalità
let     penalty                 = 0; 
// Variabili indicanti il numero di celle: totali, valide (non minate) e cliccate
let     cells_total             = 0; 
let     cells_valid             = 0; 
let     cells_clicked           = 0;
// Variabile booleana indicante l'esistenza o meno di una griglia di gioco (gioco avviato o no)
let     game_grid_exists        = false;
// Variabile booleana indicante lo status dell'ultimo gioco: concluso o ancora in corso
let     game_on_going           = false;
// Variabile booleana indicante la conclusione del gioco per vittoria
let     won                     = false; 
// Variabile contatore delle marcature (click mouse tasto destro) delle celle ritenute a rischio bomba
let     maybe_tag               = 0; 
// Variabile associata all'elemento DOM corrispondente alla griglia di gioco
let     play_ground;
// Variabile booleana di controllo che indica se si è nella fase di avvio del nuovo gioco
let     starting_game           = true; 
// Array dinamico contenente gli indici delle celle che dovranno espandersi (si svuota dopo l'espansione delle celle)
let     short_memory_array      = []; 
// Array "copia" del precedente, con la differenza che permane fino a che non si completa il ciclo di invocazione dei removeEventListener
let     long_memory_array       = [];

// Sezione relativa agli array che conterranno i dati dei giochi vinti e salvati
// Array utenti
let     array_user              = [];
// Array punteggi
let     array_score             = [];
// Array dei tempi di gioco
let     array_time              = [];
// Array delle penalità (numero di volte che si è fatto ricorso all'aiuto per vedere la disposizione delle bombe)
let     array_penalty           = [];
// Array dei livelli di difficoltà
let     array_level             = [];
// Array delle griglie di gioco
let     array_grid              = [];

// FINE DEL RAGGRUPPAMENTO DELLE COSTANTI E VARIABILI GLOBALI
// ******************************


// FUNZIONI
// ******************************

// Funzione che modifica, nel file di stile (.css), il valore della variabile indicante il numero di righe (e colonne) nel gioco
function set_row_nr_css()
{
    let css_root = document.querySelector(":root");
    css_root.style.setProperty("--rows", rows_nr);
}

// Funzione che genera e restituisce un elemento i cui tag, classi e valore coincidono con i parametri passati
// Le classi dell'elemento vengono passate sotto forma di array mentre il valore viene inserito in un tag h6 con classe display none
function new_element(tag_name, class_array, value_)
{
    let item = document.createElement(tag_name);
    for (let i = 0; i < class_array.length; i++)
    {
        item.classList.add(class_array[i]);
    }
    item.innerHTML = `<h6 class="d_none">${value_}</h6>`;
    return item;
}

// Funzione richiamata al termine della partita. Rimuove la griglia di gioco e le info/menu laterali, resetta il timer e ripristina la navbar
function reset_game()
{
    play_ground.remove();
    clock_zero();
    game_grid_exists = false;
    toggle_side_bars(side_bars_hide);
    nav_menu_toggle(false);
}

// Funzione che calcola e restituisce i punti di penalità da applicare, a seconda del livello di difficoltà del gioco appena concluso
// I punti di penalità sono tanto maggiori quanto minore è il livello di difficoltà
function penalties()
{
    switch (bombs_str)
    {
        case bombs_easy:
            return (penalty * 15);
        case bombs_medium:
            return (penalty * 8);
        default:
            return (penalty * 3);
    }
}

// Funzione richiamata per verificare se l'ultima cella cliccata conduca o meno alla vittoria; in caso affermativo si procede con il settaggio delle specifiche variabili, lo stop del timer ed il relativo messaggio
function check_if_win()
{
    if (cells_clicked == cells_valid)
    {
        // Termina partita
        won = true;
        clock_done();
        game_on_going = false;
        score = score - penalties();
        show_message(`Complimenti, hai vinto, totalizzando ${score} punti (${penalty} penalità), in ${time_num} secondi di gioco!`);
    }
}

// Funzione utilizzata per mostrare/occultare menubar e infobar (elementi con classe .toggleable) relative al gioco in corso
// La infobar viene mostrata/occultata per intero, mentre per quanto riguarda la menubar, solo un certo numero di suoi elementi viene mostrato/occultato
function toggle_side_bars(show_or_hide)
{
    let menu_list = document.querySelectorAll("#side_menu_list > .menu_item.toggleable");
    let info_bar = document.getElementById("side_info_bar");
    if (show_or_hide == side_bars_show)
    {
        for (let i = 0; i < menu_list.length; i++)
        {
            menu_list[i].classList.remove("d_none");
            menu_list[i].classList.add("d_flex","flex_main_center");
        }
        info_bar.classList.remove("d_none");
        info_bar.classList.add("d_flex","flex_main_center");
    }
    else
    {
        for (let i = 0; i < menu_list.length; i++)
        {
            menu_list[i].classList.remove("d_flex","flex_main_center");
            menu_list[i].classList.add("d_none");
        }
        info_bar.classList.remove("d_flex","flex_main_center");
        info_bar.classList.add("d_none");
    }
}

// Funzione che aggiorna le informazioni relativa alla partita in corso (nella infobar)
function update_info()
{
    document.getElementById("score_info").innerText = score;
    document.getElementById("penalty_info").innerText = penalty;
    document.getElementById("cells_info").innerText = cells_total;
    document.getElementById("bombs_info").innerText = bombs_number;
    document.getElementById("tags_info").innerText = maybe_tag;
}

// Generatore di numeri interi randomici
function random_int(max)
{
    return Math.floor(Math.random() * max);
}

// Funzione che crea le celle minate, semplicemente assegnando loro la classe "with_bomb".
// Le celle da minare vengono selezionate in maniera randomica
function load_bombs()
{
    let counter = 0;
    let random_position = 0;
    let cells_array = play_ground.querySelectorAll(".cell");
    let random_item;
    // Il ciclo "do-while" esterno assegna la classe "with_bomb" alle celle individuate dal ciclo "do-while" interno
    do
    {
         counter++;
        // Il seguente ciclo "do-while" continua a cercare posizioni libere in cui allocare le bombe
         do
         {
             random_position = random_int(cells_total);
             random_item = cells_array[random_position];
         } while (random_item.classList.contains("with_bomb"));
         random_item.classList.add("with_bomb");
         random_item.innerHTML = `<h6 class="d_none">${bomb_fa_icon}</h6>`;
    } while (counter < bombs_number);
}

// Funzione evocata per mostrare l'immagine ".gif" dell'esplosione, caratteristica del fine gioco per sconfitta (click su cella minata)
function show_explosion(boom_gif)
{
    console.log("esplosione in corso");
    play_ground.classList.add("p_rel");
    play_ground.append(boom_gif);
    game_on_going = false;
}

// Funzione che pone fine alla visualizzazione della ".gif" di fine gioco per sconfitta
function hide_explosion(boom_gif)
{
    boom_gif.remove();
    play_ground.classList.remove("p_rel");
}

// Gruppo di funzioni incaricate di gestire l'espansione delle celle libere, a seguito di click su cella non confinante con celle minate"
// ***************************************************
// La seguente funzione restituisce un valore numerico che identifica la posizione di una cella all'interno della griglia di gioco. La funzione distingue i quattro casi angolari, i quattro casi di prossimità ad un bordo ed il caso di "normalità", ovvero ubicazione centrale.
function check_border_proximity(item_index)
{
    // Nello switch si esaminano i casi in cui l'elemento indirizzato da "item_index" si trovi agli angoli della griglia
    switch (item_index)
    {
        // Angolo superiore sinistro
        case 1:
            return 1;
        // Angolo superiore destro
        case rows_nr:
            return 2;
        // Angolo inferiore destro
        case cells_total:
            return 3;
        // Angolo inferiore sinistro
        case (cells_total - rows_nr + 1):
            return 4;
    }
    // Nei seguenti "if" si esaminano i casi in cui l'elemento si trovi lungo i bordi della griglia
    // Bordo superiore
    if (item_index < rows_nr) return 5;
    // Bordo destro
    if (item_index % rows_nr == 0) return 6;
    // Bordo inferiore
    if (item_index > cells_total - rows_nr) return 7;
    // Bordo sinistro
    if ((item_index - 1) % rows_nr == 0) return 8;
    // Elemento lontano dai bordi
    return 0;
}

// Funzione che restituisce un array contenente gli indici di posizione di tutte le celle limitrofe alla cella il cui indice è passato come parametro. L'array di "return" ha dimensione variabile, a seconda della ubicazione della cella all'interno della griglia di gioco. L'ordine degli elementi restituiti (celle limitrofe a quella data) segue un andamento orario, con prima posizione occupata dalla cella in alto a destra.
function neighborhood(item_index)
{
    let grid_border = check_border_proximity(item_index);
    let result_array = [];
    // Si individuano tutte le celle limitrofe alla cella con indice "item_index" e le si inserisce in un array, in senso orario. Si tiene conto del fatto che la cella data potrebbe trovarsi su un bordo o in un angolo (vedere funzione "check_border_proximity")
    switch (grid_border)
    {
        case 1:
            result_array.push(item_index + 1);
            result_array.push(item_index + rows_nr + 1);
            result_array.push(item_index + rows_nr);
            break;
        case 2:
            result_array.push(item_index + rows_nr);         
            result_array.push(item_index + rows_nr - 1);            
            result_array.push(item_index - 1);            
            break;
        case 3:
            result_array.push(item_index - 1);         
            result_array.push(item_index - rows_nr - 1);            
            result_array.push(item_index - rows_nr);            
            break;
        case 4:
            result_array.push(item_index - rows_nr + 1);         
            result_array.push(item_index + 1);            
            result_array.push(item_index - rows_nr);            
            break;
        case 5:
            result_array.push(item_index + 1);         
            result_array.push(item_index + rows_nr + 1);         
            result_array.push(item_index + rows_nr);         
            result_array.push(item_index + rows_nr - 1);         
            result_array.push(item_index - 1);         
            break;
        case 6:
            result_array.push(item_index + rows_nr);         
            result_array.push(item_index + rows_nr - 1);         
            result_array.push(item_index - 1);         
            result_array.push(item_index - rows_nr - 1);         
            result_array.push(item_index - rows_nr);         
            break;
        case 7:
            result_array.push(item_index - rows_nr + 1);         
            result_array.push(item_index + 1);         
            result_array.push(item_index - 1);         
            result_array.push(item_index - rows_nr - 1);         
            result_array.push(item_index - rows_nr);         
            break;
        case 8:
            result_array.push(item_index - rows_nr + 1);         
            result_array.push(item_index + 1);         
            result_array.push(item_index + rows_nr + 1);         
            result_array.push(item_index + rows_nr);         
            result_array.push(item_index - rows_nr);         
            break;
        default:
            result_array.push(item_index - rows_nr + 1);         
            result_array.push(item_index + 1);         
            result_array.push(item_index + rows_nr + 1);         
            result_array.push(item_index + rows_nr);         
            result_array.push(item_index + rows_nr - 1);         
            result_array.push(item_index - 1);         
            result_array.push(item_index - rows_nr - 1);         
            result_array.push(item_index - rows_nr);         
    }
    return result_array;
}

// Funzione che restituisce, per la cella il cui indice è passato come parametro, il numero di celle minate limitrofe (confinanti).
function find_bombs_around(item_index)
{
    // Acquisizione array di prossimita'
    let neighbor_array = neighborhood(item_index);
    // Passiamo al setaccio l'array di prossimita' per contare il numero di bombe e scriverlo nell'elemento dato
    let bombs_around = 0;
    for (let i = 0; i < neighbor_array.length; i++)
    {
        let current_neighbor = play_ground.querySelector(`.cell:nth-child(${neighbor_array[i]})`);
        // Se current_neighbor (cella limitrofa attuale) è minata, si incrementa il contatore
        if (current_neighbor.classList.contains("with_bomb"))
        {
            bombs_around++;
        }
    }
    // Se, alla fine del ciclo, si è individuata almeno una cella limitrofa minata, allora viene restituito l'ammontare di esse (celle limitrofe minate....)
    if (bombs_around != 0)
    {
        return bombs_around;
    }
    // ...altrimenti si restituisce stringa vuota
    else
    {
        return "";
    }
}

// Funzione che setta ciascuna cella non minata con un numero coincidente con il numero di celle minate limitrofe
function set_bombs_around()
{
    for (let i = 1; i <= cells_total; i++)
    {
        let current_cell = play_ground.querySelector(`.cell:nth-child(${i})`);
        if (!current_cell.classList.contains("with_bomb"))
        {
            current_cell.innerHTML = `<h6 class="d_none">${find_bombs_around(i)}</h6>`;
        }
    }
}
// Fine del gruppo delle funzioni deputate all'espansione delle celle libere
// ***************************************************

// Funzione impiegata per disabilitare/abilitare gli elementi della navbar (select + pulsante play)
function nav_menu_toggle(bool)
{
    let button_play = document.querySelector("#btn_play");
    document.getElementById("rows_number_select").disabled = bool;
    document.getElementById("bombs_number_select").disabled = bool;
    button_play.disabled = bool;
    button_play.classList.toggle("active_btn");
}

// Gruppo di funzioni dedicate al timer di gioco
// ***************************************************
// Funzione di azzeramento del timer
function clock_zero()
{
    time_info_element.innerText = `00: 00': 00"`;
}

// Funzione che formatta le variabili ore, minuti e secondi e le invia al relativo elemento DOM per l'output
function clock_format()
{
    let hrs_str = hours.toString();
    let min_str = minutes.toString();
    let sec_str = seconds.toString();
    if (hours < 10)
    {
        hrs_str = "0" + hrs_str;
    }
    if (minutes < 10)
    {
        min_str = "0" + min_str;
    }
    if (seconds < 10)
    {
        sec_str = "0" + sec_str;
    }
    time_str = hrs_str + ": " + min_str + "': " + sec_str + `"`;
    time_info_element.innerText = time_str;
}

// Funzione richiamata ad intervalli di 1 secondo ed incaricata di incrementare e settare opportunamente le variabili temporali, per poi invocarne la formattazione e l'output
function clock_update()
{
    seconds++;
    if (seconds == 60)
    {
        minutes++;
        seconds = 0;
        if (minutes == 60)
        {
            hours++;
            minutes = 0;
        }
    }
    clock_format();
}

// Funzione richiamata a fine partita o in caso di abbandono. Essa blocca la reiterazione della funzione di aggiornamento e calcola il numero di secondi impiegati per concludere il gioco
function clock_done()
{
    clearInterval(timer);
    time_num = seconds + (minutes * 60) + (hours * 3600);
}

// Funzione di inizializzazione del timer. Resetta tutte le variabili e imposta la reiterazione (frequenza 1 secondo) di aggiornamento e output
function clock_init()
{
    hours = 0;
    minutes = 0;
    seconds = 0;
    time_num = 0;
    time_str = "";
    // Invocazione della funzione di aggiornamento ed output ad intervalli di 1 secondo
    timer = setInterval(function() {clock_update()},1000);
}
// Fine del gruppo di funzioni dedicate al timer di gioco
// ***************************************************

// Funzione utilizzata per la generazione di un click virtuale.
// Abbiamo bisogno del click virtuale per poter rimuovere la funzione di eventlistener collegata al click sinistro per tutte quelle celle che sono state espanse, ovvero tutte le celle risultanti "cliccate" in conseguenza del click reale su una cella non confinante con celle minate.
// La funzione di call back collegata all'evento "click sinistro" genera un "this" ed è il "this" a dover essere utilizzato per il removeEventListener, ragion per cui bisogna simulare un click sulle celle già espanse. Il long_memory_array è il contenitore in cui sono mantenuti gli indici delle celle "espanse" alle quali rimuovere l'eventlistener.
function virtual_click()
{
    // Si generano click virtuali finchè vi sono indici di celle espanse dentro l'array
    while (long_memory_array.length != 0)
    {
        let virtual_cell = play_ground.querySelector(`.cell:nth-child(${long_memory_array[0]})`).click();
        long_memory_array.splice(0,1);
    }
}

// Funzione invocata per la creazione della griglia di gioco e lo smistamento delle funzioni a seconda del tipo di evento "click"
function create_game_grid()
{
    // Manipolazione del DOM mediante creazione della griglia di gioco e delle relative celle e conseguente collegamento del tutto al main dell'html
    play_ground = document.createElement("div");
    play_ground.setAttribute("id", "game_grid");
    play_ground.classList.add("d_flex", "flex_wrap", "flex_main_btw");
    // Visualizzazione degli elementi laterali: pannello riepilogativo (infobar) ed elementi del menu di supporto (menubar)
    toggle_side_bars(side_bars_show);
    update_info();
    // Ciclo di creazione delle celle e di smistamento delle funzioni al click (sinistro o destro)
    for (let i = 1; i <= cells_total; i++)
    {
        // Creazione della cella
        let element = new_element("div", ["cell", "d_flex", "flex_center"], i);

        // Comportamento al click sinistro
        // Il problema principale nella gestione del click sinistro consiste nel fatto che, dovendo eseguire il removeEventListener all'interno della call back function dell'addEventListener per tutte le celle in espansione, ed essendo il metodo "this" non modificabile, se non mediante diretta invocazione della call back function, c'è la necessità di eseguire codeste operazioni in due tempi diversi, con invocazioni continue agli EventListener. All'occorrenza sono stati usati due array simili ma diversi: lo short_memory_array, operante solo nella fase di espansione delle celle ed il long_memory_array operante nella successiva fase di invocazione del removeEventListener.
        // NEL MOMENTO IN CUI UNA CELLA VIENE CLICCATA, PER QUELLA CELLA VIENE INVOCATA LA FUNZIONE DI CALL BACK AGGIUNTA CON IL ADDEVENTLISTENER, CON VALORE SPECIFICO DEL THIS. ALL'INGRESSO NELLA FUNZIONE, IL PROGRAMMA DEVE CAPIRE SE IL CLICK SIA REALE O VIRTUALE (IL CLICK VIRTUALE CI SERVE PER IL REMOVEEVENTLISTENER) E A DIRLO E' IL NUMERO DI ELEMENTI NEL LONG_MEMORY_ARRAY.....SE TALE ARRAY E' VUOTO SIGNIFICA CHE IL CLICK E' REALE E, NELLA LOGICA CONSEGUENTE VERRANNO EVENTUALMENTE ESPANSE DELLE CELLE, OLTRE A QUELLA EFFETTIVAMENTE CLICCATA; GLI INDICI DI TALI CELLE CONFLUIRANNO NEL LONG_MAMORY_ARRAY CHE DUNQUE, ESSENDO NON PIU' VUOTO, CONSENTIRA' ALLA SUCCESSIVA CHIAMATA DELL'EVENTLISTENER DI CAPIRE CHE IL CLICK E' VIRTUALE E PASSARE DUNQUE ALLA RIMOZIONE DELLA CALL BACK STESSA.
        element.addEventListener("click", function left_click() 
        {
            if (long_memory_array.length == 0)
            // Caso di array vuoto = click reale
            {
                // Step 1: si verifica se la cella sia stata precedentemente marcata come potenzialmente minata
                if (!this.classList.contains("maybe_bomb"))
                {
                    // Step 2: la cella non risulta marcata, dunque si verifica se sia stata già cliccata in precedenza
                    // In realtà, il seguente controllo non è necessario, essendo stato rimosso l'eventlistener. Lo si mantiene solo per monitorare il buon funzionamento della logica
                    if (!this.classList.contains("clicked_cell"))
                    {
                        // Step 3: la cella non è marcata e neanche già cliccata, dunque si verifica se sia minata
                        if (!this.classList.contains("with_bomb"))
                        {
                            // Step 4: cella non marcata, non precedentemente cliccata e non minata, quindi si procede con la gestione del click avvenuto
                            // In short_memory_array vengono inseriti e disinseriti (dopo espansione) tutti gli indici delle celle interessate
                            short_memory_array.push(i);
                            // Nel ciclo "do-while" si genera una sorta di albero centrifugo, in cui ciascun elemento "cella" viene reso "cliccato" e visibile, fino a quando non si giunge a contatto con una cella minata
                            do
                            {
                                // Il primo elemento dell'array dinamico è quello da passare al setaccio
                                let item = short_memory_array[0];
                                // Caricamento indici nel long memory array
                                // Gli indici inseriti in long_memory_array resteranno inalterati fino ad avvenuto removeEventListener
                                long_memory_array.push(item);
                                // Associazione all'elemento corrente
                                let current_item = play_ground.querySelector(`.cell:nth-child(${item})`);
                                // Operazioni tipiche della cella cliccata e senza bombe + visualizzazione del dato
                                score++;
                                current_item.classList.add("clicked_cell");
                                current_item.querySelector("h6").classList.remove("d_none");
                                cells_clicked++;
                                update_info();
                                check_if_win();
                                // Se il contenuto della cella è "0" (ovvero non confinante con celle minate) se ne analizzano le celle adiacenti e le si carica nell'array dinamico, ma solo se non ancora cliccate o presenti in detto array
                                if (current_item.querySelector("h6").innerHTML == "")
                                {
                                    let neighbor_array = neighborhood(item);
                                    // Si passano al setaccio tutte le celle limitrofe a quella principale e, nel caso, le si carica nell'array dinamico
                                    for (let j = 0; j < neighbor_array.length; j++)
                                    {
                                        let neighbor_item = play_ground.querySelector(`.cell:nth-child(${neighbor_array[j]})`)
                                        // La condizione perchè un indice di cella confinante possa essere aggiunto all'array (celle da espandere) è che essa non sia stata già cliccata e nel contempo non sia già stata inserita nell'array in quanto confinante di altre
                                        if ((!neighbor_item.classList.contains("clicked_cell")) && (!short_memory_array.includes(neighbor_array[j])))
                                        {
                                            short_memory_array.push(neighbor_array[j]);
                                        }
                                    }
                                }
                                // Rimozione della cella principale e sostituzione della stessa a inizio ciclo
                                short_memory_array.splice(0,1);
                            } while (short_memory_array.length > 0);
                            // Ora che tutta la sequenza di espansione delle celle è finita (short_memory_array vuoto) si passa alla funzione di generazione dei click virtuali di modo che tutte le celle che sono state espanse possano subire il removeEventListener
                            virtual_click();
                        }
                        // Presenza bomba
                        else
                        {
                            // E' presente una bomba ed il gioco si conclude con la sconfitta
                            // Stop al timer
                            clock_done();
                            // Settaggio della cella come "cliccata"
                            this.classList.add("clicked_cell");
                            // Visualizzazione del contenuto della cella: icona bomba (presente, come value nel tag h6 interno alla cella stessa)
                            this.firstChild.classList.toggle("d_none");
                            // Animazione:
                            let boom_gif = new_element("img", ["p_abs", "p_center"], "");
                            boom_gif.setAttribute("src",explosion_gif);
                            boom_gif.setAttribute("alt","explosione");
                            boom_gif.setAttribute("width","260%");
                            boom_gif.setAttribute("height","100%");
                            show_explosion(boom_gif);
                            // setTimeout consente di "godersi" l'animazione, indisturbati, per 5 secondi, senza interruzioni
                            setTimeout(function()
                            {
                                hide_explosion(boom_gif);
                                show_message("Hai cliccato su una cella minata e hai perso. <br> Ritenta, sarai più fortunato!");
                            }, 5000);
                        }
                    }
                    // Cella già cliccata
                    // Come già scritto nel relativo if, in condizioni di logica perfettamente funzionante, non si dovrebbe mai passare per il seguente blocco, lasciato non commentato solo con funzione di monitoraggio (bloco civetta)
                    else
                    {
                        console.log("Cella già precedentemente cliccata.");
                    }
                }
            }
            else
            // Caso in cui il long_memory_array non sia vuoto, ovvero la call back function sia stata invocata da un click virtuale
            {
                // Rimozione dell'eventlistener relativamente alla cella (this) virtualmente cliccata
                this.removeEventListener("click", left_click);
            }
        });

        // Comportamento al click destro
        element.addEventListener("contextmenu", (right_click) => 
        {
            // Inizio della funzione di gestione del click destro
            right_click.preventDefault();
            // Step 1: si verifica se la cella sia già stata cliccata (click sinitro).....in caso affermativo non si esegue nessuna funzione
            if (!element.classList.contains("clicked_cell"))
            {
                // Step 2: in assenza di un precedente click sinistro è possibile dar seguito al click destro per la marcatura/demarcatura della cella
                // Switch della marcatura
                element.classList.toggle("maybe_bomb");
                // Step 3: se la cella non era precedentemente marcata, ora lo è e si incrementa il relativo contatore delle marcature......
                if (element.classList.contains("maybe_bomb"))
                {
                    maybe_tag++;
                }
                // Step 4: ....altrimenti la cella era già marcata ed ora non lo è più, dunque si decrementa il contatore delle marcature
                else
                {
                    maybe_tag--;
                }
                // Aggiornamento delle informazioni (in particolare del numero di marcature)
                update_info();
            }
            // Fine della funzione di gestione del click destro
        });
        // Ancora all'interno del ciclo di creazione delle celle. Si collega la cella alla griglia di gioco
        play_ground.append(element);
    }
    // Una volta create tutte le celle e collegate alla griglia......
    // ...si invoca la funzione di inserimento bombe e ....
    load_bombs();
    // ...si invoca la funzione per determinare, per ogni cella non minata, il numero di celle minate nei dintorni
    set_bombs_around();
    // Infine si collega la griglia al main di html
    document.querySelector("#main_core").append(play_ground);
}

// Gruppo di funzioni dedicate alle attività svolte dentro l'area "extra"
// ***************************************************
// Funzione che attiva l'area "extra" in cui verranno visualizzati, a seconda del tasto cliccato nel menubar, gli elementi: informazioni, lista delle partite vinte nella sessione corrente, salvataggio dei dati della partita appena conclusa e vinta
function prepare_extra()
{
    // Attivazione dell'overlay che inibisce qualsiasi azione non inerente all'area extra
    let page_overlay = document.getElementById("overlay");
    page_overlay.classList.toggle("d_none");
    let extra = document.getElementById("extra_area");
    extra.classList.toggle("d_none");
}

// Funzione che disattiva l'area "extra" e torna all'area precedentemente attiva
function hide_extra()
{
    let extra = document.getElementById("extra_area");
    extra.classList.toggle("d_none");
    let page_overlay = document.getElementById("overlay");
    page_overlay.classList.toggle("d_none");  
}

// Funzione che avvia, dentro l'area extra, la procedura di salvataggio della partita appena conclusa e vinta. Visualizza i dati essenziali e rimanda allo specifico form in index.html per l'inserimento del nome del giocatore
function save_score()
{
    prepare_extra();
    let save = document.getElementById("save_score");
    save.classList.toggle("d_none");
    results = document.querySelectorAll("#save_score h4.item_value");
    results[0].innerText = `${score}`;
    results[1].innerText = `${time_num}"`;
    results[2].innerText = `${penalty}`;
    results[3].innerText = `${level_str}`;
    results[4].innerText = `${rows_nr}X${rows_nr}`;
}

// Funzione di call back che finalizza il salvataggio della partita appena conclusa e vinta
user_id_form.addEventListener("submit", (id_form) => 
{
    id_form.preventDefault();
    // Acquisizione del nome utente digitato
    let value_ = document.getElementById('user_id').value;
    // Inserimento in testa (prima posizione) nei relativi array, dei dati da salvare
    array_user.unshift(value_);
    array_score.unshift(score);
    array_time.unshift(time_num);
    array_penalty.unshift(penalty);
    array_level.unshift(level_str);
    array_grid.unshift(rows_nr);
    // Sequenza di ritorno dall'area extra/salvataggio partita
    let save = document.getElementById("save_score");
    save.classList.toggle("d_none");
    hide_extra();
});

// Funzione che consente la visualizzazione dei dati relativi a tutte le partite vinte nella sessione corrente, in sequenza Last In First Out
function show_users()
{
    // Collegamento alla tabella (NON TABLE TAG) contenente i dati delle partite.
    // #table_body è elemento di tipo "ul", quindi ciascuna partita sarà un elemento di tipo "li", contenente a sua volta un "ul" con tutti i dati delle singole partite come elemento "li"
    let table_body = document.getElementById("table_body");
    let i = 0;
    // Ciclo "while" che crea un numero di elementi ("li" = partita) uguale al numero di partite salvate negli array specifici
    while (i < array_user.length)
    {
        let current_user = new_element("li", [], 0);
        current_user.innerHTML = 
        // Ciascuna "li" partita è a sua volta un "ul" i cui "li" sono i singoli dati: nome, punti, tempo,.........
        `<ul class="d_flex data_list reset_list_style" style="padding: 3px 0; font-size: 0.7rem; border-bottom: 1px dashed darkgrey;">
        <li>${array_user[i]}</li>
        <li class="center_text">${array_score[i]}</li>
        <li class="center_text">${array_time[i]}"</li>
        <li class="center_text">${array_penalty[i]}</li>
        <li class="center_text">${array_level[i]}</li>
        <li class="center_text">${array_grid[i]}X${array_grid[i]}</li>
        </ul>`;
        table_body.append(current_user);
        i++;
    }
}

// Funzione di uscita dall'area extra invocata (con diverso valore del parametro), dalla funzione di visualizzazione delle partite e dalla funzione di visualizzazione delle informazioni di gioco
function close_window(nr)
{
    switch (nr)
    {
        case 1:
            // Caso di invocazione dal visualizzatore delle partite salvate
            let table_body = document.getElementById("table_body");
            table_body.innerHTML = "";
            let scores = document.getElementById("users_scores");
            scores.classList.toggle("d_none");
            break;
        case 2:
            // Caso di invocazione dal visualizzatore delle informazioni di gioco
            let info = document.getElementById("info_space");
            info.classList.toggle("d_none");
    }
    // In entrambi i casi, all'avvenuto click sull'icona di uscita, fa seguito la disattivazione dell'area extra
    hide_extra();
}

// Funzione di call back che da il via alla visualizzazione delle partite salvate, mediante la sequenza.....
best_btn.addEventListener("click", function()
{
    // ...attivazione dell'area extra...
    prepare_extra();
    // ...attivazione della specifica area di visualizzazione partite salvate...
    let scores = document.getElementById("users_scores");
    scores.classList.toggle("d_none");
    // ...invocazione della funzione specifica per la visualizzazione
    show_users();
});

// Funzione di call back che attiva l'area extra e, in sequenza, attiva il visualizzatore delle informazioni di gioco
info_btn.addEventListener("click", function()
{
    prepare_extra();
    let info = document.getElementById("info_space");
    info.classList.toggle("d_none");
});
// Fine del gruppo di funzioni dedicate alle attività svolte dentro l'area "extra"
// ***************************************************

// Funzione di call back che fa seguito al click sul pulsante "OK" della finestra di messaggi all'utente, consentendo la chiusura di detta finestra
msg_btn.addEventListener("click", function()
{    
    // Associazione al messaggio ed occultamento dello stesso
    let msg_box = document.getElementById("message_box");
    msg_box.classList.remove("d_flex", "flex_column", "flex_cross_center");
    msg_box.classList.add("d_none");
    // Occultamento dell'overlay
    let page_overlay = document.getElementById("overlay");
    page_overlay.classList.toggle("d_none");
    // A seconda della situazione di gioco vengono seguite diverse strade.....
    if (game_on_going)
    // Gioco ancora in corso....
    {
        if (starting_game)
        // Se il gioco è appena iniziato si inizializza il timer
        {
            clock_init();
            starting_game = false;
            console.log("Gioco appena iniziato");
        }
        else
        {
            // Altrimenti si interrompe il gioco (ha avuto luogo l'interruzione del gioco con click su icona specifica)
            console.log("Gioco appena interrotto");
            game_on_going = false;
            reset_game();
        }
    }
    else
    // Se invece il gioco non era in corso all'atto della visualizzazione del messaggio, significa che....
    {
        msg_box.classList.remove("p_top_left");
        msg_box.classList.add("p_center");
        if (won)
        {
            // ...si è concluso con una vittoria e quindi si passa al salvataggio della partita
            console.log("Hai vinto");
            save_score();
        }
        else
        {
            // ...oppure con una sconfitta (click su bomba), caso in cui la visualizzazione della sequenza di sconfitta è stata già assolta altrove
            console.log("Hai perso");
        }
        // Ad ogni modo, visto che il gioco non era in corso (partita vinta o persa), si può procedere con il reset della partita.
        reset_game();
    }
});

// Funzione che visualizza un messaggio all'utente, coincidente con il parametro "message" e posiziona un pulsante "ok", del cui click se ne occupa la funzione di call back dedicata.
// Anche la posizione del messaggio cambia, a seconda della situazione: a centro schermo nel caso di partita in corso (inizio o interrotta) oppure in alto a sinistra in caso di partita conclusa (vinta o persa).
function show_message(message)
{
    let msg_box = document.getElementById("message_box");
    if (!game_on_going)
    {
        msg_box.classList.remove("p_center");
        msg_box.classList.add("p_top_left");
    }
    let page_overlay = document.getElementById("overlay");
    page_overlay.classList.toggle("d_none");
    msg_box.classList.remove("d_none");
    msg_box.classList.add("d_flex", "flex_column", "flex_cross_center");
    msg_box.firstElementChild.innerHTML = `<h2>${message}</h2>`;
}

// Funzione invocata alla pressione del pulsante "play".
function go_to_game()
{
    // Disabilitazione della navbar
    nav_menu_toggle(true);
    // Recupero delle scelte di gioco (dalle select) ed inizializzazione e settaggio di tutte le variabili, contatore e non, inclusa modifica del numero di righe, nella relativa variabile all'interno del foglio di stile .css (variabile utilizzata per il calcolo del flex-basis delle celle)
    switch (document.getElementById("rows_number_select").value)
    {
        case "r_10":
            rows_nr = rows_10;
            break;
        case "r_9":
            rows_nr = rows_9;
            break;
        case "r_7":
            rows_nr = rows_7;
            break;
    } 
    set_row_nr_css();
    cells_total = Math.pow(rows_nr, 2);
    cells_clicked = 0;
    score = 0;
    penalty = 0;
    short_memory_array = [];
    document.getElementById('user_id').innerText = 0;
    won = false;
    maybe_tag = 0;
    switch (document.getElementById("bombs_number_select").value)
    {
        case "bombs_10":
            bombs_str = bombs_easy;
            level_str = level_easy;
            bombs_number = Math.floor(cells_total * 0.1);
            break;
        case "bombs_25":
            bombs_str = bombs_medium;
            level_str = level_medium
            bombs_number = Math.floor(cells_total * 0.25);
            break;
        case "bombs_50":
            bombs_str = bombs_hard;
            level_str = level_hard;
            bombs_number = Math.floor(cells_total * 0.5);
            break;
    }
    cells_valid = cells_total - bombs_number;
    // Invocazione della funzione di creazione della griglia di gioco
    create_game_grid();
    game_grid_exists = true;
    game_on_going = true;
    starting_game = true;
    // Messaggio all'utente mediante apposita funzione
    show_message(`Ok, puoi iniziare una nuova partita con ${rows_nr} righe e ${rows_nr} colonne`);
}

// Funzione di call back richiamata alla pressione del tasto del mouse; consente di ottenere informazioni circa il posizionamento delle celle minate ma comporta una penalità sul punteggio finale
help_btn.addEventListener("mousedown",function()
{
    let cell_content = document.querySelectorAll("#game_grid .with_bomb");
    for (let i = 0; i < bombs_number; i++)
    {
        if (!cell_content[i].classList.contains("maybe_bomb"))
        {
            cell_content[i].firstChild.classList.remove("d_none");
        }
    }
    // Incremento del contatore delle penalità e aggiornamento dei dati a schermo
    penalty++;
    update_info();
});

// Funzione di call back complementare alla precedente; viene richiamata al rilascio del tasto del mouse e nasconde, nuovamente, alla vista, le informazioni circa il posizionamento delle celle minate
help_btn.addEventListener("mouseup",function()
{
    let cell_content = document.querySelectorAll("#game_grid .with_bomb");
    for (let i = 0; i < bombs_number; i++)
    {
        if (!cell_content[i].classList.contains("maybe_bomb"))
        {
            cell_content[i].firstChild.classList.add("d_none");
        }
    }
});

// Funzione di call back eseguita alla richiesta di annullamento della partita in corso
stop_btn.addEventListener("click", function()
{
    // Interrompe immediatamente il timer e richiama la specifica funzione per mostrare un messaggio e ricominciare una nuova partita
    clock_done();
    show_message("La partita è stata chiusa.");  
});

// Inizializzazione dell'orologio
clock_zero();