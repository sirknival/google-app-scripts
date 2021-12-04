function doPost(e){
  var response = ""; var sendMsg = "";
  var chkCommand = e.parameter["command"]; 
  var text = e.parameter["text"];
  
  if (chkCommand.match('/material')) sendMsg = material(text);
  if (chkCommand.match('/firstaid')) sendMsg = firstAid(text);
  if (chkCommand.match('/food')) sendMsg = food(text);
  if (chkCommand.match('/stella')) sendMsg = help(text);
  if(e.parameter["callback_id"]=="chest") response = "DEBUG123";
 
  postSlackMessage(e.parameter['user_id'], sendMsg[0], sendMsg[1]);
  
  if(e.parameter["channel_name"]!= "directmessage")
    response += "Got it!\nSlackbot kann dir mehr sagen...";

  return ContentService.createTextOutput(response).setMimeType(ContentService.MimeType.JSON);
}

function postSlackMessage(user, msg, attach) {
  var slackWebhook = "https://slack.com/api/chat.postMessage";
  var payload = { "channel": user, "text": msg, "attachments": JSON.stringify(attach), "pretty": 1};
  var header = {"Content-type": "application/json; charset=utf-8" , "Authorization": "Bearer xoxp-"};
  var options = { "method": "post", "headers": header, "payload": JSON.stringify(payload) };

  UrlFetchApp.fetch(slackWebhook, options);
}
////////////////////////////////////////////////////////////////////////
//////////////////////////MATERIAL FUNCTION/////////////////////////////
////////////////////////////////////////////////////////////////////////
function material (getParam) {
var action = "";
  var text = ":hammer_and_pick: *LAGERMATERIAL*";
  var attach = ""; var textAttach = ""; var color= "#0f45a1";
  var sheet = SpreadsheetApp.openById('1T81hiaYzybVZGaWpuN5kSrKlToINl1cp9uHmuI7Zj4U');
  ////////////////////////[______LINK____]///////////////////////////
  if(getParam.match('link')) {
    textAttach = "Mit folgendem Link gelangst du zur Liste von der Inventur\n(Stand): \n" +
    "<https://docs.google.com/spreadsheets/d/1T81hiaYzybVZGaWpuN5kSrKlToINl1cp9uHmuI7Zj4U|Liste des RaRo-Lagers>";
  }
  ////////////////////////[______LAGER____]///////////////////////////
   else if(getParam.match('lager')) {
    var numEnd = 0;
    var numHigh = sheet.getRange("Materialliste!E3:F5").getValues();
    var range = sheet.getRange("Materialliste!A2:C"+ (numHigh[2][1]+1)).getValues();
    for(var i = 0; i < 3; i++) {
      if(i==0) { textAttach += "*Putzmaterial* :\n"; numEnd = numHigh[0][0];  }
      if(i==1) { textAttach += "\n*Allgemeines Material* :\n"; numEnd = numHigh[2][0];  }
      if(i==2) { textAttach += "\n*Kochmaterial* :\n"; numEnd = numHigh[0][1]; }
      
      for(var j = 0; j < numEnd; j++) {
        textAttach += range[j][i] + "\n";
      }
    }
  }
  var numHigh = sheet.getRange("Inventur!I3:I4").getValues();
  var range = sheet.getRange("Inventur!B2:G"+ (numHigh[0][0]+1)).getValues();
  ////////////////////////[______LIST____]///////////////////////////
  if(getParam.match('list')) {
  textAttach += "Work in Progress";
 }
               
  ////////////////////////[______ADD____]///////////////////////////
  else if(getParam.match('add')) {
  textAttach += "Work in Progress";
  }
  ////////////////////////[______INUSE____]///////////////////////////
  else if(getParam.match('inuse')) {
   var notes = new Array(numHigh[0][0]); 
    textAttach += "*Folgende Gegenstände sind ausgeborgt*:\n";
    for(var i = 0; i < numHigh[0][0]; i++) {
      if(range[i][4]=="nein") {
      textAttach += "_"+ range[i][0]+ "_\n";
      }
    }
    if(textAttach=="*Folgende Gegenstände sind ausgeborgt*:\n")
    textAttach = "Alle Gegenstände sind verfügbar!";
  }
  ////////////////////////[______NOTES____]///////////////////////////
  else if(getParam.match('notes')) {
    var notes = new Array(numHigh[0][0]); 
      for(var i = 0; i < numHigh[0][0]; i++) {
        if(range[i][5]!="") {
        textAttach += "*" + range[i][0]+ "* :"+ range[i][5] +"\n";
        }
      }
   }
  ////////////////////////[______ERROR____]///////////////////////////
  else {
  text = "Der Command ist nicht vollständig - das Attribut nach dem Command fehlt!\n" + 
         "*Beispiel*: _/material link_";
  }
  
  
  attach = [{"text": textAttach,
                 "color": color,
                 "mrkdwn_in": ["text"],
                 "attachment_type": "default",
                 "actions": action,
                 "callback_id": "dummy123" }];
return [text, attach];
}
////////////////////////////////////////////////////////////////////////
///////////////////////////FIRST AID FUNCTION///////////////////////////
////////////////////////////////////////////////////////////////////////
function firstAid (getParam) {
  var text = ":medical_symbol: *ERSTE HILFE*";
  var attach = ""; var textAttach = ""; var color= "#a21018";
  ////////////////////////[______LINK____]///////////////////////////
  if(getParam.match('link')){
  textAttach = "Mit folgendem Link gelangst du zur Liste von der Ersten Hilfe\n(Soll und Ist stand): \n" +
       "<https://docs.google.com/spreadsheets/d/1FrWGTu3rMi3EwOSBBLgh2GX_VcG_CLXBmaA9JuD379U|Liste der Ersten Hilfe>";
  }
  ////////////////////////[______LIST____]///////////////////////////  
  else if(getParam.match('list')){
    var sheet = SpreadsheetApp.openById('1FrWGTu3rMi3EwOSBBLgh2GX_VcG_CLXBmaA9JuD379U');
    var itemNum = sheet.getRange('dev').getCell(5,1).getValue();
    var range =  sheet.getRange("EH1!B2:B" + (itemNum+1)).getValues();
    for(var j = 0; j < itemNum; j++) {
      textAttach += range[j][0] + "\n";
    }
 }
   ////////////////////////[______LIST____]///////////////////////////  
  else if(getParam.match('musthave')){
    textAttach += "Work in Progress";
 }
 ////////////////////////[______ERROR____]///////////////////////////
 else {
 text = "Der Command ist nicht vollständig - das Attribut nach dem Command fehlt!\n" + 
         "*Beispiel*: _/firstaid link_";
 }
  
  var attach = [{"text": textAttach,
                 "color": color,
                 "mrkdwn_in": ["text"],
                 "attachment_type": "default"}];
  return [text, attach];
}
////////////////////////////////////////////////////////////////////////
/////////////////////////////FOOD FUNCTION//////////////////////////////
////////////////////////////////////////////////////////////////////////
function food (getParam) {
  var text = ":hamburger: *LEBENSMITTEL*";
  var attach = ""; var textAttach = ""; var color= "#2ca311";
  var sheet = SpreadsheetApp.openById('1l6MPOfzdPRakUCKfaMGv_JjDgkfhvqPSrKqwfuIhE-8');
  ////////////////////////[______LINK____]///////////////////////////      
  if (getParam.match('link')) {
  var date = sheet.getRange('dev').getCell(11,2).getValue();
    textAttach = "Mit folgendem Link gelangst du zur Liste von der Lebensmittelkiste\n("+ date+"): \n" +
       "<https://docs.google.com/spreadsheets/d/1l6MPOfzdPRakUCKfaMGv_JjDgkfhvqPSrKqwfuIhE-8|Liste der Lebensmittel &amp; co.>";
  }
  ////////////////////////[______LIST____]///////////////////////////
  else if (getParam.match('list')) {
    var numEnd = 0;
    var numHigh = sheet.getRange("FOOD1!D3:E6").getValues();
    var range = sheet.getRange("FOOD1!A2:C"+ (numHigh[3][1]+1)).getValues();
    for(var i = 0; i < 3; i++) {
      if(i==0) { textAttach += "*Essenkiste #1* :\n"; numEnd = numHigh[0][0];  }
      if(i==1) { textAttach += "\n*Essenkiste #2* :\n"; numEnd = numHigh[3][0];  }
      if(i==2) { textAttach += "\n*Gewürze #1* :\n"; numEnd = numHigh[0][1]; }
      
      for(var j = 0; j < numEnd; j++) {
        textAttach += range[j][i] + "\n";
      }
    }
  }
  else {
 text = "Der Command ist nicht vollständig - das Attribut nach dem Command fehlt!\n" + 
         "*Beispiel*: _/food link_";
 }
  
 var attach = [{"text": textAttach,
                 "color": color,
                 "mrkdwn_in": ["text"],
                 "attachment_type": "default"}];
  return [text, attach];
}
////////////////////////////////////////////////////////////////////////
/////////////////////////////HELP FUNCTION//////////////////////////////
////////////////////////////////////////////////////////////////////////
function help (getParam) {
  var text = "*Folgende Commands für /" + getParam + " stehen zur Verfügung:*\n\n";
  var attach = ""; var textAttach = ""; var color= "";
  if (getParam.match('material')) {
  textAttach =   
  "*list*:      Zeigt alle verschiedenen Kisten und deren Inhalt an. \n" +
  "*link*:     Zeigt den Link zur Materialliste(Google Sheet)an. \n" +
  "*inuse*:  Zeigt alle ausgeborgten Objekte an. \n" +
  "*add*:     Zeigt Menü zum Hinzufügen eines neues Objekts an. \n " +
  "*notes*:  Zeigt alle Anmerkungen zu div Objekten an. \n " +
  "*lager*:   Zeigt Link für Packliste von Material für Lager an.\n\n";
  color = "#0f45a1";
  }
  else if (getParam.match('firstaid')) {
  textAttach =
  "*list*:      Zeigt den aktuellen Inhalt der Ersten Hilfe an. \n" +
  "*link*:     Zeigt den Link zur Ersten Hilfe Liste(Google Sheet)an. \n" +
  "*musthave*:  Zeigt eine Liste mit den Mindestanforderungen an. \n\n";
  color = "#a21018";
  }
  else if (getParam.match('food')){ 
  textAttach = 
  "*list*:      Zeigt den aktuellen Inhalt der Lebensmittelkiste an. \n" +
  "*link*:     Zeigt den Link zur Inhaltsliste der Lebensmittel (Google Sheet)an. \n\n";
  color = "#2ca311";
  }
  else {
  text = "Der Command ist nicht vollständig - das Attribut nach dem Command fehlt!\n" + 
         "*Beispiel*: _/stella material_";
  }
  var attach = [{"text": textAttach,
                 "mrkdwn_in": ["text"],
                 "color": color,
                 "attachment_type": "default"}];
return [text, attach];
}
function sendMerchAlert() {
var text = "*MERCH UPDATE*";
  var attach = ""; var textAttach = ""; var color= "#FF6600";
  
  var sheet = SpreadsheetApp.openById('1UoHCEWpZRXnNxfuJTAvKaWqRidhwItswhoPvCYmkdP4');
  var order = sheet.getRange("Bestellliste!A5:N44").getValues();
  var price = sheet.getRange("Bestellliste!O6:P11").getValues();
 
    for(var i = 0; i < 40; i++) {
      textAttach = "Deine Bestellung beinhaltet: \n";
      for(var j = 1; j < 12; j+=2) {
        if(order[i][j]!= "") {
                textAttach += price[(j-1)/2][0] + " " + order[i][j] + "x in Größe " + order[i][j+1] + "\t(Preis: " + price[(j-1)/2][1]+ " )\n" ;
        }
      } 
      textAttach += "Gesamtpreis: " + order[i][13] + " Euro \n";
      textAttach += "Bitte zahle bitte bis .. ein auf folgendes Konto...";
      
      attach = [{"text": textAttach,
                 "color": color,
                 "mrkdwn_in": ["text"],
                 "attachment_type": "default"}];

      postSlackMessage("@" + order[i][0], text, attach);
      if(order[i+1][0]=="")
        break;
  }
}

