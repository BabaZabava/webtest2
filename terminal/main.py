import time
import random
import os
import sys

logo = r"""
(logo zůstává tady — nezkracuju ho pokud ho máš v plné verzi)
"""

# ==========================
#   Globální proměnné
# ==========================

state = {
    "okno_counter": False,
    "tlacitko_doprdele": False,
    "rozhodnuti_hyponova": False,
    "krudy_rozhodnuti_hypanova": False,
    "last_checkpoint": None,
}

choicePicovinaL = [
    "SUPER", "žraum", "lejzy", "krudý", "prcání", "kony", "koloběháček",
    "kůlnička", "dýně", "PENIS", "bum", "bac", "fasi", "JP", "MRDÁNÍ",
    "Vojta Rady", "Kraby", "Toje máma"
]

# ==========================
#   Pomocné funkce
# ==========================

def clear_screen():
    if os.name == 'nt':
        os.system('cls')
    else:
        os.system('clear')


def get_int_choice(prompt, valid_choices=None):
    """Opakovaně ptá uživatele, dokud nezadá platné celé číslo."""
    while True:
        try:
            val = int(input(prompt))
        except ValueError:
            print("Zadej číslo...")
            continue
        if valid_choices is None or val in valid_choices:
            return val
        else:
            print(f"Možnosti jsou jen: {', '.join(map(str, valid_choices))}")


def restart_or_quit():
    """Zeptá se hráče, jestli chce pokračovat od posledního checkpointu nebo skončit."""
    if state["last_checkpoint"] is None:
        print("Nemáš žádný uložený checkpoint. Hra končí.")
        sys.exit(0)

    volba = get_int_choice("Chceš se vrátit na poslední rozhodnutí? (1 = ano | 2 = konec): ", {1, 2})
    if volba == 1:
        clear_screen()
        print("Vracíš se zpátky k poslednímu rozhodnutí...")
        time.sleep(1)
        # najdeme funkci v mapě checkpointů
        checkpoint_name = state["last_checkpoint"]
        if checkpoint_name in checkpoints:
            checkpoints[checkpoint_name]()
        else:
            print("Checkpoint neexistuje, začínám od začátku.")
            main()
    else:
        print("Konec hry.")
        sys.exit(0)


# ==========================
#   SCÉNY
# ==========================

def konec():
    clear_screen()
    input("Díky za dohrání této mini hry")
    input("CK ti děkujou za pomoc s nalezením BigDho")
    input("Made by altuux/w <3")
    sys.exit(0)


def scena_ravenholm():
    state["last_checkpoint"] = "scena_ravenholm"

    clear_screen()
    input("Dorazil jsi do RavenHolmu")
    input("Vidíš zombíka...")
    input("Kachna: Kurva, zombwannabies jsou tady!")

    while True:
        rozhodnuti_zbrane = get_int_choice("Co chceš dělat? (1 = usrat si, 2 = zastřelit je): ", {1, 2})
        if rozhodnuti_zbrane == 1:
            input("Všichni zombies zemřeli na ass plyny")
            break
        elif rozhodnuti_zbrane == 2:
            input("Omylem sis ustřelil péro, nasralo se na tebe a uškrtilo tě.")
            restart_or_quit()
            return

    clear_screen()
    input("Kvůli ass plynům jsi vylítl do vesmíru a teď míříš na Xen.")
    input("Už se přibližuješ a najednou vidíš nějaké dva lidi.")
    input("Intenzita smradu BigDho hovna je obrovská, takže už musíš být blízko.")
    input("Najednou vidíš, jak BigD vstupuje zase do nějakého portálu. Vidíš také, že je s ním GMan.")
    input("Snažíš se je rychle dohnat, ale nemáš ctrl jump suit.")
    input("Povšimneš si ale Gordona Freemana s jump suitem a tak za ním běžíš a rovnou i s jump suitem mu ukradneš dýně")
    input("Se slovy Crystal Kidz jsou opposing force zabiješ FreeMana a už zase letíš za smradem, tentokrát na Zem.")
    scena_zpet_zem()


def scena_zpet_zem():
    state["last_checkpoint"] = "scena_zpet_zem"

    clear_screen()
    input("Kachna: Tyvole, už mě sere jak se Big-D furt teleportje.")
    input("Kachna si vyhledá originálniho sráče za doménou teleportacedoprdele.ck a zjistí že to je správce firmy Cock Corporations Jakub Křišťál.")
    input("Kachna nasedá do vlaku směrem do Nových Butovic. Jede se podívat na CCorp osobně.")
    input("Přijedeš k budově CCorp. Infiltruješ se dovnitř, najdeš zadní šachtu a začneš se prodírat hlouběji.")
    input("Po několika minutách šachtování vylezeš ven do dvora.")
    input("Kachna (šeptem): Tady jsem.")

    input("V dálce zahlédneš partu koloběháčků. Všimneš si, že jich je víc a že jsou celkem nasraní.")
    input("Někde uvnitř se ozývá cinkání a šplouch — teleportace to musí mít zafixovanou někde tady blízko.")

    clear_screen()
    print("Rozhodnutí:")
    print("1) Přivolat si na pomoc Krudanze, aby je rozmasil jako další pány na masení.")
    print("2) Jsem krudej a dám jim kopačku s rozeběhem sám — zvládneš to a ještě si u toho stihneš skočit na Da Fu Hao.")

    volba = get_int_choice("Co zvolíš? (1 = zavolat Krudanze, 2 = jít sám): ", {1, 2})

    if volba == 1:
        input("Kachna (do telefonu): Krudanze, čus, potřebuju tě tady, přijď rozbasit pár koloběháčků.")
        input("Chvíli čekáš a najednou vidíš jak někdo přijíždí.")
        input(".")
        input("Kachna: Krudanze! Ne — co si to udělal...")
        input("Následuje smutný pohřeb. Všechno končí stejně jako když jim dáš kopačku s rozběhem — akorát to končí pohřbem Krudanze.")
        input("(Krudanze chcípl, ale příběh pokračuje dál... Ty jsi pořád živý.)")
        input("Kachna: Jsem nasranej, ale jedeme dál.")
    else:
        input("Kachna: Jsem krudej a dám jim kopačku s rozběhem.")
        input("Přistupuješ k partě koloběháčků. Pořádně se rozběhneš a uděláš kopačku s rozběhem.")
        input("Koloběháčci létají přes bránu a padávají jako pytle.")
        input("Kachna (zadýchaně): To bylo krásný. Teď hop na Da Fu Hao!")
        input("Uskočíš na chvilku na Da Fu Hao (rychlý výlet), vracíš se a míříš ke zdroji teleportace — reaktoru.")

    # společné zakončení scény
    clear_screen()
    input("Kachna hodí Gordonovy nukleární dýně na reaktor, který zajišťuje správnou funkci teleportace.")
    input("Reaktor zajiskří a teleport se destabilizuje. Chvíli to ještě hučí, pak se celé zařízení rozjebe.")
    input("Kachna: Teď už jen za smradem hoven a konečně ho najdu.")
    input("Po chvíli pátrání zjistíš, že Big-D byl celou dobu doma. Pařil s GManem formuli a vůbec nikam neutíkal.")
    input("Kachna: Takže já byl kvůli tobě až na Xenu, zničil teleport a on si tu celý čas pařil... Kurva.")
    input("Konec: hon za BigDm... (1/3)")
    konec()


def druhy_konec_scena():
    state["last_checkpoint"] = "druhy_konec_scena"

    clear_screen()
    input("Kachna: Ne typico, na to seru. Nebudu na to klikat.")
    input("Krudanze: Ser na to, půjdeme se po něm podívat ven. Po Butkách, třeba se tu někde toulá.")
    input("Celá crew: krudý!")

    input("Vycházíte ven ze studia. Ulice Nových Butovic jsou klidný, páří se tu half life. Jen v dálce jsou nějaký WannaBees.")
    input("Vojta Rady: Tady to smrdí... jako by tu někdo smažil teleporty.")
    input("Klaudius Prince: Hele, támhle bliká něco na obzoru...")

    print("\nRozhodnutí:")
    print("1) Jít za blikáním (prozkoumat původ signálu)")
    print("2) Jít na kolu do Da Fu Hao (vymrdat se na to)")

    vyber = get_int_choice("Co uděláš? ", {1, 2})
    if vyber == 1:
        input("Kachna: To blikání vypadá jako nějaký... signál?")
        input("Blížíš se k němu a vidíš rozbitý server s logem CCorp.")
        input("Z přístroje se ozve: 'Chyba systému: teleportace přesměrována na... *Butovice*'")
        input("Krudanze: Takže on je tady, kurva! On je TADY!")
        input("Kachna: Big-D teleportoval sám sebe sem, ale... bez těla? To je jen jeho vůně?!")
        input("Krudanze: Jeho úsery!")
        input("Najednou se všechno rozsvítí — a celá crew padá do teleportu...")
        input("nedokončený konec")
        konec()
    else:
        input("Kachna: Serem na to. Dáme si něco na uklidnění.")
        input("Celá crew zamíří do Da Fu Hao. Krudanze si objedná pět nudlí a tři piva.")
        input("Vojta: Hele... třeba ten BigD fakt jen hraje formuli a my to řešíme zbytečně.")
        input("Kachna: Jestli jo, tak mu tam ten teleport nacpu do prdele osobně.")
        input("Na stole zůstává otevřený notebook... a na něm stránka www.teleportacedoprdele.ck bliká nápisem 'ZAPNUTO'.")
        input("Konec: mrdáme na něj... (3/3)")
    konec()


# ==========================
#   HLAVNÍ HRA
# ==========================

def main():
    clear_screen()
    print(logo)
    time.sleep(1)
    clear_screen()
    print("Ztracenej BigD === v.2013")
    print("Hraješ jako Kachna a probouzíš se u Krudanze ve studiu")

    state["last_checkpoint"] = "zacatek_hry"

    input("Pro pokračování hry zmáčkni enter...")
    input("Krudanze leží vedle tebe, stejně jako Vojta a Klaudius Prince. Podíváš se na ně a vidíš, jak se Krudanze drbe na koulích")
    input("potom si k tomu čichne, ta vůně mu připomene BidDho...")
    input("Krudanze: hmmm, dopici, kde je BigD?")
    print("Kachna: ", end="", flush=True)
    for i in range(1, 4):
        print(".", end="", flush=True)
        time.sleep(0.7)
    print("\n")
    input("Kachna: Ajo dopici, ještě včera v noci dělal něco na kompu, ne?")
    input("Vojta Rady: Ze židle jsou ještě cejtit jeho úsery. Ale nikde tady není...")

    clear_screen()

    while True:
        vyber1 = get_int_choice("Chceš se podívat na počítač? Třeba se tam něco najde (1 = počítač, 2 = skočit z okna): ", {1, 2})
        if vyber1 == 1:
            if state["okno_counter"]:
                state["okno_counter"] = False
            break
        elif vyber1 == 2:
            if state["okno_counter"]:
                print("Říkám že tu okno není, píčo...")
                break
            else:
                print("Žádný okno tu není, kokote...")
                state["okno_counter"] = True
                continue

    clear_screen()
    input("Usedl jsi k počítači a zavřel jsi všechny tabs s pornem")
    odpovediPorno = [
        "Cože? Porno? To se snad posral, proč ho tam má tak málo? Se snad posral ne?",
        "Kurva to je Windows 11?? Nechuťák"
    ]
    input("Kachna: " + random.choice(odpovediPorno))
    input("Na počítači je otevřená stránka www.teleportacedoprdele.ck")
    input("Klaudius: Co tam má za picoviny?")
    input("Kachna: Hele, co když tady zmáčknu tohle (teleportacedoprdele)")

    vyber_teleport = get_int_choice("Chceš zmáčknout tlačítko? (1 = ano, 2 = ne): ", {1, 2})
    if vyber_teleport == 1:
        state["tlacitko_doprdele"] = True
    else:
        state["tlacitko_doprdele"] = False

    if state["tlacitko_doprdele"]:
        input("Krudanze: Kachno, ne!")
        clear_screen()
        for i in range(3, 0, -1):
            print(i)
            time.sleep(1)
        clear_screen()
        for i in range(0, 50):
            choicePicovina = random.choice(choicePicovinaL)
            print(choicePicovina)
            time.sleep(0.03)
        clear_screen()
        input("Objevíš se v Hypanově")
        input("Kachna: Kurva, kde to jsem?")
        input("Kachna: Tady jsou samý župany!")
        input("Kachna se trochu zorientuje")
        input("Kachna: Tyvole, to jsou Jack a Johny!")

        state["rozhodnuti_hyponova"] = (get_int_choice("Chceš jít za nima? (1 = ano, 2 = ne): ", {1, 2}) == 1)

        if state["rozhodnuti_hyponova"]:
            input("Kachna: Tyvole čau, neviděli jste BigDho?")
            input("Jack: Hej víš kdo já jsem? Já jsem krudej gangsta a jmenuju se Jack")
            input("Johny: Hej víš kdo já jsem? Já jsem krudej gangsta a jmenuju se Johny")

            state["krudy_rozhodnuti_hypanova"] = (get_int_choice("Co jim řekneš? (1 = Drž hubu, kde je BigD?; 2 = Úser): ", {1, 2}) == 1)

            if state["krudy_rozhodnuti_hypanova"]:
                input("Kacha: Drž hubu, kde je BigD?")
                input("Jack: BigD šel s nějakým týpkem kolem. Ten týpek měl suit a nějakej přiteplenej úsměv.")
                input("Johny: Jo a taky spolu srali ve křoví.")
                input("Kacha: To určitě smrděli, co?")
                input("Jack & Johny: My už to čicháme rádi tady <3")
                input("Jdeš do křoví, podívat se na hovna.")
                input("Kachna: JO! To byl určitě BigD, poznám to totiž po chuti.")
                input("Jdeš po pachu dále...")
                scena_ravenholm()
            else:
                input("Usral jsi si.")
                input("Zbili tě...")
                input("Prohrál jsi!")
                restart_or_quit()
        else:
            input("Kachna: I regret nothing")
            input("Kachna vybouchne")
            restart_or_quit()

    else:
        input("Kachna: Ne typico, na to seru. Nebudu na to klikat")
        input("Krudanze: Ser na to, půjdem se po něm podívat ven. Po Butkách, třeba se tu někde toulá.")
        input("celá crew: krudý!")
        druhy_konec_scena()


# mapa checkpointů
checkpoints = {
    "scena_ravenholm": scena_ravenholm,
    "scena_zpet_zem": scena_zpet_zem,
    "zacatek_hry": main,
}


# ==========================
#   SPUŠTĚNÍ HRY
# ==========================

if __name__ == "__main__":
    main()
