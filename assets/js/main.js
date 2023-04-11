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
const   rows_10             = 10;       //valore di default
const   rows_9              = 9;
const   rows_7              = 7;
// Variabile indicante il numero di righe selezionato
let     rows_nr             = rows_10;

// Sezione relativa alla quantità di bombe presenti nel gioco (livello di difficoltà):
// Costanti semantiche, di tipo stringa, indicanti la percentuale di bombe presenti nel gioco (livello di difficoltà)
const   bombs_easy          = "10%";    //valore di default
const   bombs_medium        = "25%";
const   bombs_hard          = "50%";
const   level_easy          = "Bassa";    //valore di default
const   level_medium        = "Media";
const   level_hard          = "Alta";
// Variabili (stringa e numerica) indicanti il numero di bombe presenti nel gioco (livello di difficoltà)
let     bombs_str           = bombs_easy;   
let     level_str           = level_easy; 
let     bombs_number        = 0;  
// Immagine ".gif" utilizzata alla conclusione del gioco dovuta a click su cella minata
const   explosion_gif       = "https://media.tenor.com/-g-Um3DDvV0AAAAM/explosion.gif"; 
// Icone Font Awesome usate all'occorrenza, per pulsanti menù e celle minate
const   bomb_fa_icon        = '<i class="fa-solid fa-bomb fa-beat fa-2xl" style="color: #ff0000;"></i>';
const   stop_fa_icon        = '<i class="fa-solid fa-xmark"></i>'; 

// Sezione relativa al conta-tempo
// Stringa di output del tempo
let     time_str            = "";
// Variabile numerica indicante i secondi totali di gioco
let     time_num            = 0;
// Variabili numeriche incrementali indicanti ore, minuti e secondi
let     hours               = 0;
let     minutes             = 0;
let     seconds             = 0;   
// Variabile associata alla funzione setInterval
let     timer; 
// Variabile associata all'elemento DOM corrispondente alla visualizzazione del tempo
let     time_info_element   = document.getElementById("time_info");

// Sezione relativa alle costanti semantiche utilizzate nella visualizzazione/occultamento degli elementi laterali
const   side_bars_show      = true; 
const   side_bars_hide      = false; 

// Sezione variabili e costanti specifiche
// Variabile punteggio
let     score               = 0; 
// Variabile penalità
let     penalty             = 0; 
// Variabili indicanti il numero di celle: totali, valide (non minate) e cliccate
let     cells_total         = 0; 
let     cells_valid         = 0; 
let     cells_clicked       = 0;
// Variabile booleana indicante l'esistenza o meno di una griglia di gioco (gioco avviato o no)
let     game_grid_exists    = false;
// Variabile booleana indicante lo status dell'ultimo gioco: concluso o ancora in corso
let     game_on_going       = false;
// Variabile booleana indicante la conclusione del gioco per vittoria
let     won                 = false; 
// Variabile contatore delle marcature (click mouse tasto destro) delle celle ritenute a rischio bomba
let     maybe_tag           = 0; 
// Variabile associata all'elemento DOM corrispondente alla griglia di gioco
let     play_ground;
// Variabile booleana di controllo che indica se si è nella fase di avvio del nuovo gioco
let     starting_game       = true; 
// Array dinamico contenente gli indici delle celle che dovranno espandersi
let     expansion_array     = []; 

// Sezione relativa agli array che conterranno i dati dei giochi vinti e salvati
// Array utenti
let     array_user          = [];
// Array punteggi
let     array_score         = [];
// Array dei tempi di gioco
let     array_time          = [];
// Array delle penalità (numero di volte che si è fatto ricorso all'aiuto per vedere la disposizione delle bombe)
let     array_penalty       = [];
// Array dei livelli di difficoltà
let     array_level         = [];
// Array delle griglie di gioco
let     array_grid          = [];

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

// Funzione impiegata per disabilitare/riabilitare il pulsante "play", a seconda del parametro (booleano)
function btn_play_toggle(bool)
{
    let button_play = document.querySelector("#btn_play");
    button_play.classList.toggle("active_btn");
    button_play.disabled = bool;
}

// Funzione principale del gioco
// I parametri della funzione identificano la cella appena cliccata. A seconda dello stato della cella (marcata, già cliccata o minata) si seguono comportamenti differenti
function handle_click(clicked_item, index)
{
    // Step 1: si verifica se la cella sia stata precedentemente marcata come potenzialmente minata
    if (!clicked_item.classList.contains("maybe_bomb"))
    {
        // Step 2: la cella non risulta marcata, dunque si verifica se sia stata già cliccata in precedenza
        if (!clicked_item.classList.contains("clicked_cell"))
        {
            // Step 3: la cella non è marcata e neanche già cliccata, dunque si verifica se sia minata
            if (!clicked_item.classList.contains("with_bomb"))
            {
                // Step 4: cella non marcata, non precedentemente cliccata e non minata, quindi si procede con la gestione del click avvenuto
                // Il parametro identifica la cella cliccata dal giocatore. 
                expansion_array.push(index);
                // Nel ciclo "do-while" si genera una sorta di albero centrifugo, in cui ciascun elemento "cella" viene reso "cliccato" e visibile, fino a quando non si giunge a contatto con una cella minata
                do
                {
                    // Il primo elemento dell'array dinamico è quello da passare al setaccio
                    let item = expansion_array[0];
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
                            if ((!neighbor_item.classList.contains("clicked_cell")) && (!expansion_array.includes(neighbor_array[i])))
                            {
                                expansion_array.push(neighbor_array[i]);
                            }
                        }
                    }
                    // Rimozione della cella principale e sostituzione della stessa a inizio ciclo
                    expansion_array.splice(0,1);
                } while (expansion_array.length > 0);
            }
            else
            {
                // E' presente una bomba ed il gioco si conclude con la sconfitta
                // Stop al timer
                clock_done();
                // Settaggio della cella come "cliccata"
                clicked_item.classList.add("clicked_cell");
                // Visualizzazione del contenuto della cella: icona bomba (presente, come value nel tag h6 interno alla cella stessa)
                clicked_item.firstChild.classList.toggle("d_none");
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
        else
        {
            console.log("Cella già precedentemente cliccata");
        }
    }
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
                if (element.classList.contains("maybe_bomb"))
                {
                    maybe_tag++;
                }
                else
                {
                    maybe_tag--;
                }
                update_info();
            }
        });
        play_ground.append(element);
    }
    load_bombs();
    set_bombs_around();
    document.querySelector("#main_core").append(play_ground);
}

function prepare_extra()
{
    let page_overlay = document.getElementById("overlay");
    page_overlay.classList.toggle("d_none");
    let extra = document.getElementById("extra_area");
    extra.classList.toggle("d_none");
}

function hide_extra()
{
    let extra = document.getElementById("extra_area");
    extra.classList.toggle("d_none");
    let page_overlay = document.getElementById("overlay");
    page_overlay.classList.toggle("d_none");  
}

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

user_id_form.addEventListener("submit", (id_form) => 
{
    id_form.preventDefault();
    let value_ = document.getElementById('user_id').value;
    array_user.unshift(value_);
    array_score.unshift(score);
    array_time.unshift(time_num);
    array_penalty.unshift(penalty);
    array_level.unshift(level_str);
    array_grid.unshift(rows_nr);
    let save = document.getElementById("save_score");
    save.classList.toggle("d_none");
    hide_extra();
    console.log(array_user);
    console.log(array_score);
    console.log(array_time);
    console.log(array_penalty);
    console.log(array_level);
    console.log(array_grid);
    // sort_arrays();
});

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
            save_score();
        }
        else
        {
            console.log("Hai perso");
        }
        reset_game();
    }


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
    expansion_array = [];
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
    create_game_grid();
    game_grid_exists = true;
    game_on_going = true;
    starting_game = true;
    show_message(`Ok, puoi iniziare una nuova partita con ${rows_nr} righe e ${rows_nr} colonne`);
}

function show_users()
{
    let table_body = document.getElementById("table_body");
    let i = 0;
    while (i < array_user.length)
    {
        let current_user = new_element("li", [], 0);
        current_user.innerHTML = 
        `<ul class="d_flex data_list reset_list_style" style="padding: 3px 0; font-size: 0.7rem; border-bottom: 1px dashed darkgrey;">
        <li>${array_user[i]}</li>
        <li class="center_text">${array_score[i]}</li>
        <li class="center_text">${array_time[i]}"</li>
        <li class="center_text">${array_penalty[i]}</li>
        <li class="center_text">${array_level[i]}</li>
        <li class="center_text">${array_grid[i]}X${array_grid[i]}</li>
        </ul>`;
        console.log(current_user);
        table_body.append(current_user);
        i++;
    }
}

function close_window(nr)
{
    switch (nr)
    {
        case 1:
            let table_body = document.getElementById("table_body");
            table_body.innerHTML = "";
            let scores = document.getElementById("users_scores");
            scores.classList.toggle("d_none");
            break;
        case 2:
            let info = document.getElementById("info_space");
            info.classList.toggle("d_none");
    }
    hide_extra();
}

best_btn.addEventListener("click", function()
{
    prepare_extra();
    let scores = document.getElementById("users_scores");
    scores.classList.toggle("d_none");
    show_users();
});

info_btn.addEventListener("click", function()
{
    prepare_extra();
    let info = document.getElementById("info_space");
    info.classList.toggle("d_none");
});

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
});

// Inizializzazione dell'orologio
clock_zero();