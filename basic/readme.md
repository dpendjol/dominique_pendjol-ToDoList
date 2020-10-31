#### De ToDo list voldoet aan de volgende requirements

### Requirements:

[x] Als gebruiker wil ik een inputveld zien waarin ik mijn taak in kan vullen.
[x] Als gebruiker kan ik op een button drukken met de tekst "Add Task" waardoor je ingevulde taak toegevoegd wordt - aan de lijst.
  [x] Lees het tekstveld uit
    [x] selecteer input element
    [x] sla value op in variabele
  [x] Set de taak in een object samen met property done: op false
    [x] sla op in variabele const format omschrijving: taak, done: false
  [x] Stuur het verzoek naar de api
    [x] gebruik fetch met methode: post, api 'eist' content-type: application-json
[x] Als gebruiker zie ik wanneer ik op de add button knop heb geklikt, de taak verschijnen in mijn takenlijst.
[x] Taak verwijderen: Als gebruiker kan ik in de takenlijst op een icoontje klikken van een prullenbak, rechts naast de taak, waardoor de taak uit mijn takenlijst wordt verwijderd.
  - 

- let op: er zijn echt enorm veel voorbeelden van TODO-list apps met Vanilla JavaScript te vinden op het internet ⇒ Code een-op-een kopiëren van een website of van een mede-student is niet de bedoeling.

### API requirements:
[x] GET: Verkrijg de (initiële) lijst met taken van de database.
[x] POST: Update de takenlijst met 1 nieuwe taak. Stuur alleen {description: "blah", done: false} 
[x] DELETE: Verwijder een taak uit de database. Gebruik de id die je terugkrijgt als identifier.
[x] Maak een file genaamd api-client.js zoals je hebt geleerd in de afgelopen tijd voor al je requests.

### Extra requirements:

[x] Taak doorstrepen: Als gebruiker kan ik in de takenlijst op een checkbox klikken, links naast de taak, waardoor de tekst van de taak doorgestreept wordt en ik mijn taak kan afstrepen.
[x] Als gebruiker wil ik op mijn taak kunnen klikken en de tekst kunnen aanpassen.
  [x] Registeer op welke taak geklikt wordt
  [x] Kopieer de tekst van het label
  [x] verwijder het label
  [x] plaats een input tag met de waarde van het label
- Extra API requirements (die samenhangt met het bovenstaande):

PUT: update een bestaande taak de property done of niet done.
PUT: update en bestaande taak met de PUT method.

### Own Added:
- Groeper de taken in verschillende lijsten
- Sorteer op toegevoegde datum
- Prullebak verwisseld in vinkje bij aanpassen task. Klik op vinkje = ook safe
- wissel change event naar keypress event alleen bij enter


### BUGHUNT
- Na het toevoegen van prullebak icoontje werkt delete niet meer
  [x] Fixed, id werd verkeerd lezen. Staat namelijk in parent ID, door toevoegen extra tag, moest de 'grandparent' aangesproken worden.
