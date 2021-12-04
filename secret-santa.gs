function start () {
ScriptApp.newTrigger("sendEmails")
  .timeBased()
  .after(1000 * 5) //1h
  .create();
}

function sendEmails () {
  var sheet = SpreadsheetApp.openById('############SPREDSHEETID-HERE############');
  
  var dataFood =  sheet.getRange("Formularantworten 1!B2:B9").getValues();
  var dataMail = sheet.getRange("Formularantworten 1!C2:C9").getValues();

  var dataFood = ShiftRandom(dataFood);
  var size = dataFood.length;
    for (var i = 0; i < size; i++) {
    var emailAddress = dataMail[i];
    var food_wish = dataFood[i];
    var base_message = 'Yay! Endlich geht es wieder um Essen. Du hast folgenden Wunsch zugeteilt bekommen: ';
    var subject = 'Secret Cook  -  Finally';
     var message = base_message + food_wish + ' !';
    message += "\nHappy Hunting!"
    
        //MailApp.sendEmail(emailAddress.toString(), subject, message);
  }
} 

function sendEmailsSanta () {
  var sheet = SpreadsheetApp.openById('############SPREDSHEETID-HERE############');
  var check = 0;
  
  var names =  sheet.getRange("Formularantworten 1!B2:B9").getValues();
  var dataMail = sheet.getRange("Formularantworten 1!C2:C9").getValues();

   var guspImageLink = "https://raw.githubusercontent.com/sirknival/sirknival.github.io/main/Pfad-4.jpg";

  var guspPicture = UrlFetchApp.fetch(guspImageLink)
                                    .getBlob()
                                    .setName("Wichtel-Caaarew");

  do {
    Logger.log("Iteration");
    var dataName = randomize(names);
    var lastIndex = 0;

    check = 0;
    for(var k = 0 ; k < dataName.length; k++){
      if(k == dataName[k]){
          check = 1;
          break;
      }
      lastIndex = dataName[lastIndex];
      if(lastIndex == 0 && k+1 != dataName.length){
        check = 1;
        break;
      }
    }
  }while(check == 1);
  
  Logger.log("[0.0, 1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0]")
  Logger.log(dataName)
  
  for (var i = 0; i < dataName.length; i++) {
    var emailAddress = dataMail[i];
    var nameGift = names[dataName[i]];
    Logger.log(i +". Receiver: "+ nameGift + " - Sender:"+ emailAddress);

    var my_subject = 'Menschi, es ist bald Weihnachten!';
    var base_message = '<html><p>Achja ...Weihnachten. Die Jahreszeit, zu der alle gestresst durch die Gassen hetzen, Geschenke besorgen und dabei zwischendurch von einem Glühweinstand zum nächsten wanken. Zuhause läuft im Radio Last Christmas in Dauerschleife, während am Fernseher ein kitschiger Weihnachtsfilm flimmert, in dem sich am Ende immer zwei Personen auf romantischen Irrwegen verlieben... Tja, wenn all das zutrifft, dann ist Weihnachten wohl wirklich nahe.</p><p> Haaaaaaaaaaalt stop! Wir schreiben das Jahr 2. pc (post corona-begin), da läuft all dies ein wenig anders ab: Punsch- und Glühweinstände haben geschlossen, das Radio wurde durch die Spotifyplaylist der Wahl ersetzt, der Weihnachtsfilm durch einen Zoom-Spieleabend mit Freunden. Somit hält sich auch der ganze Stress in Grenzen. Aber wie ist das Dilemma mit den Geschenken zu lösen? Du wolltest doch <b style="color:green">';
    base_message += nameGift;
    base_message += ' </b>kleine Freude bereiten und ein kleines Geschenk am <b style="color:green">19.12.2021</b> überreichen. Dein Vorsatz war, etwas Außergewöhnliches, etwas <b style="color:green">Kurioses</b> zu schenken? Hast du schon eine  Idee; wenn nicht solltest du dir langsam Gedanken machen .. <p></p>In Liebe dein Weihnachtsbengerl <b style="color:red"><3</b> <br>PS: Der Wert der möglichst kuriosen Aufmerksamkeit sollte nicht dein <b style="color:green">Budget von 10 Euro </b> übersteigen</p> <html>'; 

    var mail = {
      to : emailAddress.toString(),
      subject : my_subject,
      htmlBody : base_message,
      inlineImages: {
        myPicture  :guspPicture
      }
    };   
        //MailApp.sendEmail(mail);
  }
}


function randomize(array) {
  var size = array.length;
  var order = [size];
  var array_new= [];
  var j = 0, i = 0;
  var rand_num = 0;
  var flag_done = 0;
  
  for (j = 0; j < size; j++)
    order[j]=1;
    

    while(!flag_done){
        do{
            rand_num = Math.floor((Math.random()*size));
        }while(order[rand_num] == 0);
        order[rand_num] = 0;
        array_new.push(rand_num);
        rand_num = 0;
        for (i = 0; i < size; i++)
          flag_done += order[i];
        if(flag_done == 0)
          break;
        else
          flag_done = 0;
    }
  return array_new;
}

function ShiftRandom(array) {
  var size = array.length;
  var shift = Math.floor(Math.random() * Math.floor(size-1)) +1 ;
  var array_new = [];
  
  for (var i = 0; i < size; i++) {
    if (i + shift < size) {
      array_new[i] = array[i + shift];
    }
    if (i + shift >= size) {
      array_new[i] = array[i + shift - size];
    }
      
 }
 return array_new;
}


//IN DEV
function getContent (array) {
  var start = 0;
  var end = 0;
  var array_new = [];
  var size = array.length;

  for (var i = 0; i < size; i++) {
    
    if (array[i] != "" && start == 0) {
      start = i;
    }
    
    if (array[i] == "" && start != 0) {
      end = i;
      break;
    }   
  }
  for (var i = start; i < end; i++) {
    array_new[i - start] = array[start];
  }

  return array_new;
}

function checkCylelength() {
  var array = [0,1,2,3,4,5];
  var randomized = [3, 2, 4, 5, 0, 1];
  var start = array[0];
  var counter = 0 ;

  do {
    counter += 1;
  }
  while(start !=array[randomized[counter]]);
  Logger.log(counter);
}
