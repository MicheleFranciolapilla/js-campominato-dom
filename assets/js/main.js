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

// Array dinamico contenente gli indici delle celle che dovranno espandersi
let     classic_game_array  = []; 

// Sezione relativa al numero di righe:
// Costanti semantiche indicanti il numero di righe selezionato
const   rows_10             = 10;       //valore di default
const   rows_9              = 9;
const   rows_7              = 7;
// Variabile indicante il numero di righe selezionato
let     rows_nr             = rows_10;

// Sezione relativa alla quantità di bombe presenti nel gioco:
// Costanti semantiche, di tipo stringa, indicanti la percentuale di bombe presenti nel gioco
const   bombs_easy          = "10%";    //valore di default
const   bombs_medium        = "25%";
const   bombs_hard          = "50%";
// Variabili (stringa e numerica) indicanti il numero di bombe presenti nel gioco
let     bombs_str           = bombs_easy;   
let     bombs_number        = 0;  
// Immagine ".gif" utilizzata alla conclusione del gioco dovuta a click su cella minata
const   explosion_gif       = "https://media.tenor.com/-g-Um3DDvV0AAAAM/explosion.gif"; 
// Icone Font Awesome usate all'occorrenza, per pulsanti menù e celle minate
const   bomb_fa_icon        = '<i class="fa-solid fa-bomb fa-beat fa-2xl" style="color: #ff0000;"></i>';
const   stop_fa_icon        = '<i class="fa-solid fa-xmark"></i>'; 

// Sezione relativa alle costanti semantiche utilizzate nella visualizzazione/occultamento delle barre laterali
const   side_bars_show      = true; 
const   side_bars_hide      = false; 

// Sezione variabili e costanti specifiche
// Variabile punteggio
let     score               = 0; 
let     penalty             = 0; 
// Variabili indicanti il numero di celle: totali, valide (non minate) e cliccate
let     cells_total         = 0; 
let     cells_valid         = 0; 
let     cells_clicked       = 0;
// Variabile booleana indicante l'esistenza o meno di una griglia di gioco (gioco avviato o no)
let     game_grid_exists    = false;
// Variabile booleana indicante lo status dell'ultimo gioco: concluso o ancora in corso
let     game_on_going       = false;
// Variabili booleane usate in fase di conclusione gioco, rispettivamente per sconfitta o per vittoria
let     won                 = false; 
// Variabile associata alla griglia di gioco
let     play_ground;
let     time_str            = "";
let     time_num            = 0;
let     hours               = 0;
let     minutes             = 0;
let     seconds             = 0;   
let     timer; 
let     starting_game       = true; 
let     time_info_element   = document.getElementById("time_info");

// Funzione che modifica, nel file di stile (.css), il valore della variabile indicante il numero di righe (e colonne) nel gioco
function set_row_nr_css()
{
    let css_root = document.querySelector(":root");
    css_root.style.setProperty("--rows", rows_nr);
}

// Funzione che genera e restituisce un elemento i cui tag, classi e valore coincidono con i parametri passati
// Le classi dell'elemento vengono passate sotto forma di array
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

// Funzione richiamata al termine della partita. Essa rimuove la griglia di gioco e le info/menu laterali, ripristina le select nella navbar e resetta la variabile booleana "game_grid_exists"
function reset_game()
{
    play_ground.remove();
    clock_zero();
    game_grid_exists = false;
    toggle_side_bars(side_bars_hide);
    nav_menu_toggle(false);
}

// Funzione richiamata per verificare se l'ultima cella cliccata conduca o meno alla vittoria. In caso affermativo si procede con il relativo messaggio
function check_if_win()
{
    if (cells_clicked == cells_valid)
    {
        // Termina partita
        won = true;
        score = score - (penalty * 5);
        clock_done();
        game_on_going = false;
        show_message(`Complimenti, hai vinto, totalizzando ${score} punti (${penalty} penalità), in ${time_num} secondi di gioco!`);
    }
}

// Funzione utilizzata per attivare/disattivare la menubar e la infobar relative al gioco in corso
function toggle_side_bars(show_or_hide)
{
    let menu_list = document.querySelectorAll("#side_menu_list > .menu_item");
    let info_bar = document.getElementById("side_info_bar");
    if (show_or_hide == side_bars_show)
    {
        for (let i = 1; i < menu_list.length; i++)
        {
            menu_list[i].classList.remove("d_none");
            menu_list[i].classList.add("d_flex","flex_main_center");
        }
        info_bar.classList.remove("d_none");
        info_bar.classList.add("d_flex","flex_main_center");
    }
    else
    {
        for (let i = 1; i < menu_list.length; i++)
        {
            menu_list[i].classList.remove("d_flex","flex_main_center");
            menu_list[i].classList.add("d_none");
        }
        info_bar.classList.remove("d_flex","flex_main_center");
        info_bar.classList.add("d_none");
    }
}

// Funzione che aggiorna le informazioni relativa alla partita in corso
function update_info()
{
    document.getElementById("score_info").innerText = score;
    document.getElementById("penalty_info").innerText = penalty;
    document.getElementById("cells_info").innerText = cells_total;
    document.getElementById("bombs_info").innerText = bombs_number;
}

// Generatore di numeri interi randomici
function random_int(max)
{
    return Math.floor(Math.random() * max);
}

// Funzione che crea le celle minate, semplicemente assegnando loro la classe "with_bomb".
function load_bombs()
{
    let counter = 0;
    let random_position = 0;
    let cells_array = play_ground.querySelectorAll(".cell");
    let random_item;
    // Il primo dei due cicli "do-while" consente di allocare tutte le bombe previste dal gioco in corso
    do
    {
         counter++;
        //  Il seguente ciclo "do-while" continua a cercare posizioni libere in cui allocare le bombe
         do
         {
             random_position = random_int(cells_total);
             random_item = cells_array[random_position];
         }
         while (random_item.classList.contains("with_bomb"));
         random_item.classList.add("with_bomb");
         random_item.innerHTML = `<h6 class="d_none">${bomb_fa_icon}</h6>`;
    }
    while (counter < bombs_number);
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
    console.log("esplosione finita");
}

// Gruppo di funzioni esclusive del "gioco-classico"
// ***************************************************
// La seguente funzione restituisce un valore numerico che identifica la posizione di una cella all'interno della griglia di gioco. La funzione distingue i quattro casi angolari, i quattro casi di prossimità ad un bordo ed il caso di "normalità", ovvero ubicazione centrale. Questa funzione viene utilizzata solo nel "gioco-classico"
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

// Funzione che restituisce un array contenente gli indici di posizione di tutte le celle limitrofe alla cella il cui indice è passato come parametro. L'array di output ha dimensione variabile, a seconda della ubicazione della cella all'interno della griglia di gioco. L'ordine degli elementi in output (celle limitrofe a quella data) segue un andamento orario, con prima posizione occupata dalla cella in alto a destra. Questa funzione viene utilizzata solo nel "gioco-classico".
function neighborhood(item_index)
{
    let grid_border = check_border_proximity(item_index);
    let result_array = [];
    // Si individuano tutte le celle limitrofe alla cella con indice "item_index" e le si inserisce in un array, in senso orario. Si tiene conto del fatto che la cella data potrebbe trovarsi su un bordo o in un angolo.
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

// Funzione che restituisce, per la cella il cui indice è passato come parametro, il numero di celle minate limitrofe (confinanti). Funzione usata solo nel "gioco-classico"
function set_classic_cell(item_index)
{
    // Acquisizione array di prossimita'
    let neighbor_array = neighborhood(item_index);
    // Passiamo al setaccio l'array di prossimita' per contare il numero di bombe e scriverlo nell'elemento dato
    let bombs_around = 0;
    for (let i = 0; i < neighbor_array.length; i++)
    {
        let current_neighbor = play_ground.querySelector(`.cell:nth-child(${neighbor_array[i]})`);
        if (current_neighbor.classList.contains("with_bomb"))
        {
            bombs_around++;
        }
    }
    if (bombs_around != 0)
    {
        return bombs_around;
    }
    else
    {
        return "";
    }
}

// Funzione che setta ciascuna cella non minata con un numero coincidente con il numero di celle minate limitrofe. Funzione usata solo nel "gioco-classico"
function set_classic_data()
{
    for (let i = 1; i <= cells_total; i++)
    {
        let current_cell = play_ground.querySelector(`.cell:nth-child(${i})`);
        if (!current_cell.classList.contains("with_bomb"))
        {
            current_cell.innerHTML = `<h6 class="d_none">${set_classic_cell(i)}</h6>`;
        }
    }
}

function btn_play_toggle(bool)
{
    let button_play = document.querySelector("#btn_play");
    button_play.classList.toggle("active_btn");
    button_play.disabled = bool;
}

function remove_event_listener(clicked_item, index)
{
    console.log("evento in rimozione");
    this.removeEventListener("click", handle_click());
}


function handle_click(clicked_item, index)
{
    if (!clicked_item.classList.contains("maybe_bomb"))
    {
        if (!clicked_item.classList.contains("clicked_cell"))
        {
            if (!clicked_item.classList.contains("with_bomb"))
            {
                // Il parametro identifica la cella cliccata dal giocatore
                classic_game_array.push(index);
                // Nel ciclo "do-while" si genera una sorta di albero centrifugo, in cui ciascun elemento "cella" viene reso "cliccato" e visibile
                do
                {
                    // Il primo elemento dell'array dinamico è quello da passare al setaccio
                    let item = classic_game_array[0];
                    let current_item = play_ground.querySelector(`.cell:nth-child(${item})`);
    
                    // Operazioni tipiche della cella cliccata e senza bombe + visualizzazione del dato
                    score++;
                    update_info();
                    current_item.classList.add("clicked_cell");
                    current_item.querySelector("h6").classList.remove("d_none");
                    cells_clicked++;
                    check_if_win();
                    // Se il contenuto della cella è "0" (ovvero non confinante con celle minate) se ne analizzano le celle adiacenti e le si carica nell'array dinamico, ma solo se non ancora cliccate o presenti in detto array
                    if (current_item.querySelector("h6").innerHTML == "")
                    {
                        let neighbor_array = neighborhood(item);
                        // Si passano al setaccio tutte le celle limitrofe a quella principale e, nel caso, le si carica nell'array dinamico
                        for (let i = 0; i < neighbor_array.length; i++)
                        {
                            let neighbor_item = play_ground.querySelector(`.cell:nth-child(${neighbor_array[i]})`)
                            if ((!neighbor_item.classList.contains("clicked_cell")) && (!classic_game_array.includes(neighbor_array[i])))
                            {
                                classic_game_array.push(neighbor_array[i]);
                            }
                        }
                    }
                    // Rimozione della cella principale e sostituzione della stessa a inizio ciclo
                    classic_game_array.splice(0,1);
                } while (classic_game_array.length > 0);
            }
            else
            {
                // E' presente una bomba ed il gioco si conclude con la sconfitta
                // Animazione esplosione
                clock_done();
                clicked_item.classList.add("clicked_cell");
                clicked_item.firstChild.classList.toggle("d_none");
                let boom_gif = new_element("img", ["p_abs", "p_center"], "");
                boom_gif.setAttribute("src",explosion_gif);
                boom_gif.setAttribute("alt","explosione");
                boom_gif.setAttribute("width","260%");
                boom_gif.setAttribute("height","100%");
                show_explosion(boom_gif);
                setTimeout(function()
                {
                    hide_explosion(boom_gif);
                    show_message("Hai cliccato su una cella minata e hai perso. <br> Ritenta, sarai più fortunato!");
                }, 5000);
            }
        }
        else
        {
            // remove_event_listener(this, index);
            // this.removeEventListener("click", handle_click(this, index));
            console.log("check for event remove");

        }
    }
}

function clock_zero()
{
    time_info_element.innerText = `00: 00': 00"`;
}

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
    console.log(time_str);
}

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

function clock_done()
{
    clearInterval(timer);
    time_num = seconds + (minutes * 60) + (hours * 3600);
    console.log(time_num);
}

function clock_init()
{
    hours = 0;
    minutes = 0;
    seconds = 0;
    time_num = 0;
    time_str = "";
    timer = setInterval(function() {clock_update()},1000);
}

function create_game_grid()
{
    play_ground = document.createElement("div");
    play_ground.setAttribute("id", "game_grid");
    play_ground.classList.add("d_flex", "flex_wrap", "flex_main_btw");
    toggle_side_bars(side_bars_show);
    update_info();
    for (let i = 1; i <= cells_total; i++)
    {
        let element = new_element("div", ["cell", "d_flex", "flex_center"], i);
        element.addEventListener("click", function() {handle_click(this, i)});
        element.addEventListener("contextmenu", (right_click) => 
        {
            right_click.preventDefault();
            if (!element.classList.contains("clicked_cell"))
            {
                element.classList.toggle("maybe_bomb");
            }
        });
        play_ground.append(element);
    }
    load_bombs();
    set_classic_data();
    document.querySelector("#main_core").append(play_ground);
}


msg_btn.addEventListener("click", function()
{    
    let msg_box = document.getElementById("message_box");
    msg_box.classList.remove("d_flex", "flex_column", "flex_cross_center");
    msg_box.classList.add("d_none");
    let page_overlay = document.getElementById("overlay");
    page_overlay.classList.toggle("d_none");
    if (game_on_going)
    {
        if (starting_game)
        {
            clock_init();
            starting_game = false;
            console.log("Gioco appena iniziato");
        }
        else
        {
            console.log("Gioco appena interrotto");
            game_on_going = false;
            reset_game();
        }
    }
    else
    {
        msg_box.classList.remove("p_top_left");
        msg_box.classList.add("p_center");
        if (won)
        {
            console.log("Hai vinto");
        }
        else
        {
            console.log("Hai perso");
        }
        reset_game();
    }

    // if ((exploded) || (won))
    // {
    //     game_on_going = false;
    //     reset_game();
    // }
});

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

function nav_menu_toggle(bool)
{
    let button_play = document.querySelector("#btn_play");
    document.getElementById("rows_number_select").disabled = bool;
    document.getElementById("bombs_number_select").disabled = bool;
    button_play.disabled = bool;
    button_play.classList.toggle("active_btn");
}

function go_to_game()
{
    nav_menu_toggle(true);
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
    classic_game_array = [];
    won = false;
    switch (document.getElementById("bombs_number_select").value)
    {
        case "bombs_10":
            bombs_str = bombs_easy;
            bombs_number = Math.floor(cells_total * 0.1);
            break;
        case "bombs_25":
            bombs_str = bombs_medium;
            bombs_number = Math.floor(cells_total * 0.25);
            break;
        case "bombs_50":
            bombs_str = bombs_hard;
            bombs_number = Math.floor(cells_total * 0.5);
            break;
    }
    cells_valid = cells_total - bombs_number;
    create_game_grid();
    game_grid_exists = true;
    game_on_going = true;
    starting_game = true;
    show_message(`Ok, puoi iniziare una nuova partita con ${rows_nr} righe e ${rows_nr} colonne`);
}

// function go_to_game()
// {
//     if (!game_grid_exists)
//     {
//         // Significa che la griglia non c'e' e che non si sta giocando, quindi si puo' iniziare
//         switch (document.getElementById("rows_number_select").value)
//         {
//             case "r_10":
//                 rows_nr = rows_10;
//                 break;
//             case "r_9":
//                 rows_nr = rows_9;
//                 break;
//             case "r_7":
//                 rows_nr = rows_7;
//                 break;
//         }
//         show_message(`Ok, puoi iniziare una nuova partita con ${rows_nr} righe e ${rows_nr} colonne`);
//         set_row_nr_css();
//         create_game_grid();
//     }
//     else 
//         if (!game_on_going)
//         {
//             show_message("Ok, ricominciamo");
//             reset_game();
//             go_to_game();
//         }
//         else
//         {
//             show_message(`La partita è ancora in corso. <br> Premi sull'icona (${stop_fa_icon}) per terminarla.`);
//             // Significa che e' in corso un gioco e che non e' ancora terminato
//         }
// }






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
    penalty++;
    update_info();
});

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

stop_btn.addEventListener("click", function()
{
  clock_done();
  show_message("La partita è stata chiusa.");  
//   game_on_going = false;
//   reset_game();
});

clock_zero();