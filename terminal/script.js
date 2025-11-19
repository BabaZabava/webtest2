const input = document.getElementById('command-input');
const output = document.getElementById('output');
const terminal = document.getElementById('terminal');

// ---- pomocné utility ----
function appendOutput(text) {
  const newLine = document.createElement('div');
  newLine.textContent = text;
  output.appendChild(newLine);
  terminal.scrollTop = terminal.scrollHeight;
}

function clearOutput() {
  output.innerHTML = '';
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function nowString() {
  return new Date().toLocaleString();
}

// ---- shell commands (původní) ----
const commands = {
  help: () => `
Dostupné příkazy:
  help      - zobrazí tuto nápovědu
  about     - info o CK shellu
  game      - zahraj si pařbu v terminálu
  crew      - CK crew
  clear     - vyčistí obrazovku
  time      - ukáže čas
  gott      - gott
  hegerová  - hegerová
  credits   - kdo vytvořil tuhle píčovinu
`,
  clear: () => {
    clearOutput();
    return '';
  },

  time: () => {
    const target = new Date(2025, 10, 19, 0, 0, 0); // měsíc 10 = listopad (0-based month index)
    const now = new Date();
    let diff = target - now;

    if (diff <= 0) {
      return 'Cílové datum (19.11.2025) již uplynulo.';
    }

    const msInSecond = 1000;
    const msInMinute = msInSecond * 60;
    const msInHour = msInMinute * 60;
    const msInDay = msInHour * 24;

    const days = Math.floor(diff / msInDay);
    diff -= days * msInDay;

    const hours = Math.floor(diff / msInHour);
    diff -= hours * msInHour;

    const minutes = Math.floor(diff / msInMinute);
    diff -= minutes * msInMinute;

    const seconds = Math.floor(diff / msInSecond);

    return `Zbývá: ${days} dní ${hours} hodin ${minutes} minut ${seconds} sekund`;
  },

  about: () => `[CK Shell v2.013] 
 do ruky si naprcej a pak te voprcej`,

  crew: () => 'Vojta Rady, Krudanze, Kachna, Klaudius Princ',

  JP: () => 'KurvaDopici1959',

  hegerová: () => 'MRTVÁ!',

  gott: () => 'mrtvej mf wha',

  credits: () => 'vykadil altuux a Sbni s <3',
};

// ---- herní engine (port z main.py) ----
const state = {
  okno_counter: false,
  tlacitko_doprdele: false,
  rozhodnuti_hyponova: false,
  krudy_rozhodnuti_hypanova: false,
  last_checkpoint: null,
};

const choicePicovinaL = [
  "SUPER", "žraum", "lejzy", "krudý", "prcání", "kony", "koloběháček",
  "kůlnička", "dýně", "PENIS", "bum", "bac", "fasi", "JP", "MRDÁNÍ",
  "Vojta Rady", "Kraby", "Tvoje máma"
];

let inGame = false;
// resolver pro aktuální herní vstup (await)
let gameInputResolve = null;

// vyzve hráče a vrátí string (nebo 'exit' pokud hráč napíše exit)
function promptGameInput(promptText = '') {
  // zobrazit prompt jako output aby hráč viděl výzvu
  if (promptText) appendOutput(promptText);
  return new Promise(resolve => {
    gameInputResolve = resolve;
    // focus on input for pohodlí
    input.focus();
  });
}

// get_int_choice: čeká až hráč zadá celé číslo a je v valid_choices (Set) pokud je předáno
async function get_int_choice(promptText, valid_choices = null) {
  while (true) {
    const raw = await promptGameInput(promptText);
    if (raw === null) return null; // shouldn't happen
    const trimmed = String(raw).trim();
    if (trimmed.toLowerCase() === 'exit') {
      return 'exit';
    }
    const val = parseInt(trimmed, 10);
    if (isNaN(val)) {
      appendOutput("Zadej číslo...");
      continue;
    }
    if (valid_choices == null || valid_choices.has(val)) {
      return val;
    } else {
      appendOutput(`Hele, kokote. Máš na výběr jenom: ${Array.from(valid_choices).join(', ')}`);
    }
  }
}

// input(prompt) ekvivalent: čeká na stisk Enter (může hráč napsat cokoliv, ignorujeme obsah)
async function game_input(promptText = '') {
  // v Pythonu input() vypíše zprávu a čeká na enter — zde necháme hráče napsat cokoliv a pokračujeme
  const raw = await promptGameInput(promptText);
  if (raw && String(raw).trim().toLowerCase() === 'exit') return 'exit';
  return raw; // obsah se běžně nepoužívá v main.py, slouží jen jako pauza
}

function clear_screen() {
  clearOutput();
}

// restart_or_quit: podle stavu last_checkpoint
async function restart_or_quit() {
  if (state.last_checkpoint === null) {
    appendOutput("Nemáš žádný uložený checkpoint. Hra končí.");
    endGame(); // ukončí hru
    return 'quit';
  }
  const volba = await get_int_choice("Chceš se vrátit na poslední rozhodnutí? (1 = ano | 2 = konec): ", new Set([1,2]));
  if (volba === 'exit') {
    endGame();
    return 'exit';
  }
  if (volba === 1) {
    clear_screen();
    appendOutput("Vracíš se zpátky k poslednímu rozhodnutí...");
    await sleep(1000);
    const checkpoint_name = state.last_checkpoint;
    if (checkpoint_name in checkpoints) {
      // zavolat JS funkci checkpointu
      await checkpoints[checkpoint_name]();
      return 'restarted';
    } else {
      appendOutput("Checkpoint neexistuje, začínám od začátku.");
      await main_scene();
      return 'restarted';
    }
  } else {
    appendOutput("Konec hry.");
    endGame();
    return 'quit';
  }
}

// konec: vypsat závěrečné inputy a ukončit
async function konec() {
  clear_screen();
  await game_input("Díky za dohrání této mini hry");
  await game_input("CK ti děkujou za pomoc s nalezením BigDho");
  await game_input("Made by altuux/w <3");
  endGame();
}

async function scena_ravenholm() {
  state.last_checkpoint = "scena_ravenholm";

  clear_screen();
  if (await game_input("Dorazil jsi do RavenHolmu") === 'exit') return;
  if (await game_input("Vidíš zombíka...") === 'exit') return;
  if (await game_input("Kachna: Kurva, zombwannabies jsou tady!") === 'exit') return;

  while (true) {
    const rozhodnuti_zbrane = await get_int_choice("Co chceš dělat? (1 = usrat si, 2 = zastřelit je): ", new Set([1,2]));
    if (rozhodnuti_zbrane === 'exit') { endGame(); return; }
    if (rozhodnuti_zbrane === 1) {
      if (await game_input("Všichni zombies zemřeli na ass plyny") === 'exit') return;
      break;
    } else if (rozhodnuti_zbrane === 2) {
      if (await game_input("Omylem sis ustřelil péro, nasralo se na tebe a uškrtilo tě.") === 'exit') return;
      const r = await restart_or_quit();
      if (r === 'exit' || r === 'quit') return;
      return; // restart_or_quit will call checkpoint or end; we stop here
    }
  }

  clear_screen();
  if (await game_input("Kvůli ass plynům jsi vylítl do vesmíru a teď míříš na Xen.") === 'exit') return;
  if (await game_input("Už se přibližuješ a najednou vidíš nějaké dva lidi.") === 'exit') return;
  if (await game_input("Intenzita smradu BigDho hovna je obrovská, takže už musíš být blízko.") === 'exit') return;
  if (await game_input("Najednou vidíš, jak BigD vstupuje zase do nějakého portálu. Vidíš také, že je s ním GMan.") === 'exit') return;
  if (await game_input("Snažíš se je rychle dohnat, ale nemáš ctrl jump suit.") === 'exit') return;
  if (await game_input("Povšimneš si ale Gordona Freemana s jump suitem a tak za ním běžíš a rovnou i s jump suitem mu ukradneš dýně") === 'exit') return;
  if (await game_input("Se slovy Crystal Kidz jsou opposing force zabiješ FreeMana a už zase letíš za smradem, tentokrát na Zem.") === 'exit') return;
  await scena_zpet_zem();
}

async function scena_zpet_zem() {
  state.last_checkpoint = "scena_zpet_zem";

  clear_screen();
  if (await game_input("Kachna: Tyvole, už mě sere jak se Big-D furt teleportje.") === 'exit') return;
  if (await game_input("Kachna si vyhledá originálniho sráče za doménou teleportacedoprdele.ck a zjistí že to je správce firmy Cock Corporations Jakub Křišťál.") === 'exit') return;
  if (await game_input("Kachna nasedá do vlaku směrem do Nových Butovic. Jede se podívat na CCorp osobně.") === 'exit') return;
  if (await game_input("Přijedeš k budově CCorp. Infiltruješ se dovnitř, najdeš zadní šachtu a začneš se prodírat hlouběji.") === 'exit') return;
  if (await game_input("Po několika minutách šachtování vylezeš ven do dvora.") === 'exit') return;
  if (await game_input("Kachna (šeptem): Tady jsem.") === 'exit') return;

  if (await game_input("V dálce zahlédneš partu koloběháčků. Všimneš si, že jich je víc a že jsou celkem nasraní.") === 'exit') return;
  if (await game_input("Někde uvnitř se ozývá cinkání a šplouch — teleportace to musí mít zafixovanou někde tady blízko.") === 'exit') return;

  clear_screen();
  appendOutput("Rozhodnutí:");
  appendOutput("1) Přivolat si na pomoc Krudanze, aby je rozmasil jako další pány na masení.");
  appendOutput("2) Jsem krudej a dám jim kopačku s rozeběhem sám — zvládneš to a ještě si u toho stihneš skočit na Da Fu Hao.");

  const volba = await get_int_choice("Co zvolíš? (1 = zavolat Krudanze, 2 = jít sám): ", new Set([1,2]));
  if (volba === 'exit') { endGame(); return; }

  if (volba === 1) {
    if (await game_input("Kachna (do telefonu): Krudanze, čus, potřebuju tě tady, přijď rozbasit pár koloběháčků.") === 'exit') return;
    if (await game_input("Chvíli čekáš a najednou vidíš jak někdo přijíždí.") === 'exit') return;
    if (await game_input(".") === 'exit') return;
    if (await game_input("Kachna: Krudanze! Ne — co si to udělal...") === 'exit') return;
    if (await game_input("Následuje smutný pohřeb. Všechno končí stejně jako když jim dáš kopačku s rozběhem — akorát to končí pohřbem Krudanze.") === 'exit') return;
    if (await game_input("(Krudanze chcípl, ale příběh pokračuje dál... Ty jsi pořád živý.)") === 'exit') return;
    if (await game_input("Kachna: Jsem nasranej, ale jedeme dál.") === 'exit') return;
  } else {
    if (await game_input("Kachna: Jsem krudej a dám jim kopačku s rozběhem.") === 'exit') return;
    if (await game_input("Přistupuješ k partě koloběháčků. Pořádně se rozběhneš a uděláš kopačku s rozběhem.") === 'exit') return;
    if (await game_input("Koloběháčci létají přes bránu a padávají jako pytle.") === 'exit') return;
    if (await game_input("Kachna (zadýchaně): To bylo krásný. Teď hop na Da Fu Hao!") === 'exit') return;
    if (await game_input("Uskočíš na chvilku na Da Fu Hao (rychlý výlet), vracíš se a míříš ke zdroji teleportace — reaktoru.") === 'exit') return;
  }

  // společné zakončení scény
  clear_screen();
  if (await game_input("Kachna hodí Gordonovy nukleární dýně na reaktor, který zajišťuje správnou funkci teleportace.") === 'exit') return;
  if (await game_input("Reaktor zajiskří a teleport se destabilizuje. Chvíli to ještě hučí, pak se celé zařízení rozjebe.") === 'exit') return;
  if (await game_input("Kachna: Teď už jen za smradem hoven a konečně ho najdu.") === 'exit') return;
  if (await game_input("Po chvíli pátrání zjistíš, že Big-D byl celou dobu doma. Pařil s GManem formuli a vůbec nikam neutíkal.") === 'exit') return;
  if (await game_input("Kachna: Takže já byl kvůli tobě až na Xenu, zničil teleport a on si tu celý čas pařil... Kurva.") === 'exit') return;
  if (await game_input("Konec: hon za BigDm... (1/3)") === 'exit') return;
  await konec();
}

async function druhy_konec_scena() {
  state.last_checkpoint = "druhy_konec_scena";

  clear_screen();
  if (await game_input("Kachna: Ne typico, na to seru. Nebudu na to klikat.") === 'exit') return;
  if (await game_input("Krudanze: Ser na to, půjdeme se po něm podívat ven. Po Butkách, třeba se tu někde toulá.") === 'exit') return;
  if (await game_input("Celá crew: krudý!") === 'exit') return;

  if (await game_input("Vycházíte ven ze studia. Ulice Nových Butovic jsou klidný, páří se tu half life. Jen v dálce jsou nějaký WannaBees.") === 'exit') return;
  if (await game_input("Vojta Rady: Tady to smrdí... jako by tu někdo smažil teleporty.") === 'exit') return;
  if (await game_input("Klaudius Prince: Hele, támhle bliká něco na obzoru...") === 'exit') return;

  appendOutput("\nRozhodnutí:");
  appendOutput("1) Jít za blikáním (prozkoumat původ signálu)");
  appendOutput("2) Jít na kolu do Da Fu Hao (vymrdat se na to)");

  let vyber = await get_int_choice("Co uděláš? ", new Set([1,2]));
  if (vyber === 'exit') { endGame(); return; }
  if (vyber === 1) {
    if (await game_input("Kachna: To blikání vypadá jako nějaký... signál?") === 'exit') return;
    if (await game_input("Blížíš se k němu a vidíš rozbitý server s logem CCorp.") === 'exit') return;
    if (await game_input("Z přístroje se ozve: 'Chyba systému: teleportace přesměrována na... *Butovice*'") === 'exit') return;
    if (await game_input("Krudanze: Takže on je tady, kurva! On je TADY!") === 'exit') return;
    if (await game_input("Kachna: Big-D teleportoval sám sebe sem, ale... bez těla? To je jen jeho vůně?!") === 'exit') return;
    if (await game_input("Krudanze: Jeho úsery!") === 'exit') return;
    if (await game_input("Najednou se všechno rozsvítí — a celá crew padá do teleportu...") === 'exit') return;
    if (await game_input("nedokončený konec") === 'exit') return;
    await konec();
  } else {
    if (await game_input("Kachna: Serem na to. Dáme si něco na uklidnění.") === 'exit') return;
    if (await game_input("Celá crew zamíří do Da Fu Hao. Krudanze si objedná pět nudlí a tři piva.") === 'exit') return;
    if (await game_input("Vojta: Hele... třeba ten BigD fakt jen hraje formuli a my to řešíme zbytečně.") === 'exit') return;
    if (await game_input("Kachna: Jestli jo, tak mu tam ten teleport nacpu do prdele osobně.") === 'exit') return;
    if (await game_input("Na stole zůstává otevřený notebook... a na něm stránka www.teleportacedoprdele.ck bliká nápisem 'ZAPNUTO'.") === 'exit') return;
    if (await game_input("Konec: mrdáme na něj... (3/3)") === 'exit') return;
    await konec();
  }
}

// --- hlavní hra (main) ---
async function main_scene() {
  await sleep(1000);
  clear_screen();
  appendOutput("Ztracenej BigD === v.2013");
  appendOutput("Hraješ jako Kachna a probouzíš se u Krudanze ve studiu");

  state.last_checkpoint = "zacatek_hry";

  await game_input("Pro pokračování hry zmáčkni enter...");
  clear_screen();
  await game_input("Krudanze leží vedle tebe, stejně jako Vojta a Klaudius Prince. Podíváš se na ně a vidíš, jak se Krudanze drbe na koulích");
  await game_input("potom si k tomu čichne, ta vůně mu připomene BidDho...");
  await game_input("Krudanze: hmmm, dopici, kde je BigD?");
  appendOutput("Kachna: ");
  // tečkování
  for (let i = 1; i <= 3; i++) {
    appendOutput(".");
    await sleep(700);
  }
  await game_input("Kachna: Ajo dopici, ještě včera v noci dělal něco na kompu, ne?");
  await game_input("Vojta Rady: Ze židle jsou ještě cejtit jeho úsery. Ale nikde tady není...");

  clear_screen();

  while (true) {
    // Pokud hráč zkusil skočit z okna už 2×, zůstane jen možnost 1
    const jenPocitac = state.okno_counter >= 2;
    const moznosti = jenPocitac ? new Set([1]) : new Set([1, 2]);

    // Dynamicky přizpůsobený text otázky
    const promptText = jenPocitac
      ? "Chceš se podívat na počítač? Třeba se tam něco najde (1 = počítač): "
      : "Chceš se podívat na počítač? Třeba se tam něco najde (1 = počítač, 2 = skočit z okna): ";

    const vyber1 = await get_int_choice(promptText, moznosti);

    if (vyber1 === 'exit') {
      endGame();
      return;
    }

    if (vyber1 === 1) {
      state.okno_counter = 0;
      break;
    } else if (vyber1 === 2) {
      state.okno_counter = (state.okno_counter || 0) + 1;

      if (state.okno_counter === 1) {
        appendOutput("Žádný okno tu není, kokote...");
      } else if (state.okno_counter === 2) {
        appendOutput("Říkám že tu okno není, píčo...");
      } else {
        appendOutput("Už tu fakt žádný okno není...");
      }

      continue; // Znovu zobrazí prompt (možná už bez volby 2)
    }
  }

  clear_screen();
  await game_input("Usedl jsi k počítači a zavřel jsi všechny tabs s pornem");
  const odpovediPorno = [
    "Cože? Porno? To se snad posral, proč ho tam má tak málo? Se snad posral ne?",
    "Kurva to je Windows 11?? Nechuťák"
  ];
  await game_input("Kachna: " + odpovediPorno[Math.floor(Math.random() * odpovediPorno.length)]);
  await game_input("Na počítači je otevřená stránka www.teleportacedoprdele.ck");
  await game_input("Klaudius: Co tam má za picoviny?");
  await game_input("Kachna: Hele, co když tady zmáčknu tohle (teleportacedoprdele)");

  const vyber_teleport = await get_int_choice("Chceš zmáčknout tlačítko? (1 = ano, 2 = ne): ", new Set([1,2]));
  if (vyber_teleport === 'exit') { endGame(); return; }
  state.tlacitko_doprdele = (vyber_teleport === 1);

  if (state.tlacitko_doprdele) {
    await game_input("Krudanze: Kachno, ne!");
    clear_screen();
    for (let i = 3; i >= 1; i--) {
      appendOutput(String(i));
      await sleep(1000);
    }
    clear_screen();
    // rychlý spam jako v originále
    for (let i = 0; i < 50; i++) {
      const choicePicovina = choicePicovinaL[Math.floor(Math.random() * choicePicovinaL.length)];
      appendOutput(choicePicovina);
      await sleep(30);
    }
    clear_screen();
    await game_input("Objevíš se v Hypanově");
    await game_input("Kachna: Kurva, kde to jsem?");
    await game_input("Kachna: Tady jsou samý župany!");
    await game_input("Kachna se trochu zorientuje");
    await game_input("Kachna: Tyvole, to jsou Jack a Johny!");

    state.rozhodnuti_hyponova = (await get_int_choice("Chceš jít za nima? (1 = ano, 2 = ne): ", new Set([1,2])) === 1);
    if (state.rozhodnuti_hyponova === 'exit') { endGame(); return; }

    if (state.rozhodnuti_hyponova) {
      await game_input("Kachna: Tyvole čau, neviděli jste BigDho?");
      await game_input("Jack: Hej víš kdo já jsem? Já jsem krudej gangsta a jmenuju se Jack");
      await game_input("Johny: Hej víš kdo já jsem? Já jsem krudej gangsta a jmenuju se Johny");

      const krudy_choice = await get_int_choice("Co jim řekneš? (1 = Drž hubu, kde je BigD?; 2 = Úser): ", new Set([1,2]));
      if (krudy_choice === 'exit') { endGame(); return; }
      state.krudy_rozhodnuti_hypanova = (krudy_choice === 1);

      if (state.krudy_rozhodnuti_hypanova) {
        await game_input("Kacha: Drž hubu, kde je BigD?");
        await game_input("Jack: BigD šel s nějakým týpkem kolem. Ten týpek měl suit a nějakej přiteplenej úsměv.");
        await game_input("Johny: Jo a taky spolu srali ve křoví.");
        await game_input("Kacha: To určitě smrděli, co?");
        await game_input("Jack & Johny: My už to čicháme rádi tady <3");
        await game_input("Jdeš do křoví, podívat se na hovna.");
        await game_input("Kachna: JO! To byl určitě BigD, poznám to totiž po chuti.");
        await game_input("Jdeš po pachu dále...");
        await scena_ravenholm();
      } else {
        await game_input("Usral jsi si.");
        await game_input("Zbili tě...");
        await game_input("Prohrál jsi!");
        quit()
      }
    } else {
      await game_input("Kachna: I regret nothing");
      await game_input("Kachna vybouchne");
      quit()
    }
  } else {
    await game_input("Kachna: Ne typico, na to seru. Nebudu na to klikat");
    await game_input("Krudanze: Ser na to, půjdem se po něm podívat ven. Po Butkách, třeba se tu někde toulá.");
    await game_input("celá crew: krudý!");
    await druhy_konec_scena();
  }
}

// mapa checkpointů
const checkpoints = {
  "scena_ravenholm": scena_ravenholm,
  "scena_zpet_zem": scena_zpet_zem,
  "zacatek_hry": main_scene
};

// ukončení hry: zastaví inGame a vrátí kontrolu shellu
function endGame() {
  appendOutput("[hra ukončena] - vracíš se do CK Shellu");
  inGame = false;
  // zrušit resolver pokud čeká
  if (gameInputResolve) {
    gameInputResolve('exit');
    gameInputResolve = null;
  }
}

// spustí hru (příkaz 'game')
async function startGameCommand() {
  if (inGame) {
    appendOutput("Hra již běží.");
    return;
  }
  inGame = true;
  appendOutput("Spouštím pařbu...");
  try {
    await main_scene();
  } catch (err) {
    console.error("Chyba v herním módu:", err);
    appendOutput("Došlo k chybě v herním módu.");
  } finally {
    inGame = false;
  }
}

// ---- integrace s běžným shellem ----
function runCommand(inputText) {
  const [cmd, ...args] = inputText.trim().split(' ');
  const command = commands[cmd];

  // pokud jsme v herním módu a není očekáván game input, ignoruj ostatní příkazy
  if (inGame) {
    appendOutput("Jsi v herním módu — napiš odpověď (číslo) nebo 'exit' pro ukončení.");
    return;
  }

  if (command) {
    const result = command(args);
    if (result !== '') appendOutput(result);
  } else if (inputText.trim() !== '') {
    appendOutput(`co to meles dopici?? zkus 'help'.`);
  }
}

// přidáme příkaz 'game' do commands, který spouští herní engine
commands.game = () => {
  startGameCommand();
  return '';
};

// ---- input handler ----
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const value = input.value;
    // jestli je inGame a čeká se na herní input, resolve promise
    if (inGame && gameInputResolve) {
      const resolver = gameInputResolve;
      gameInputResolve = null;
      resolver(value);
      input.value = '';
      return;
    }

    // pokud inGame ale není čekání (třeba hra vypisuje), informuj
    if (inGame && !gameInputResolve) {
      appendOutput(`CKShell >>> ${value}`);
      appendOutput("Hele nemrdej do toho, když to něco dělá...");
      input.value = '';
      return;
    }

    // běžný režim shellem
    appendOutput(`CKShell >>> ${value}`);
    runCommand(value.trim());
    input.value = '';
  }
});
