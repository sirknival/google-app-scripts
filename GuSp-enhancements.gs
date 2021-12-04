/**
 * Find all matches of target text in current document, and highlight them.
 *
 * @param {String} target     (Optional) The text or regex to search for. 
 *                            See Body.findText() for details.
 * @param {String} background (Optional) The desired highlight color.
 *                            A default orange is provided.
 */
 
//Source: https://stackoverflow.com/questions/12064972/can-i-color-certain-words-in-google-document-using-google-apps-script
var namesList = ['Caro', 'Flo', 'Gorg', 'Gzuz', 'Jarrod', 'Peter', 'Patrick', 'Tobi', 'Vali'];
var colors = ['#E06666', '#F6B26B', '#FFD966', '#93C47D', '#2E8C0E', '#A0EFEF', '#6D9EEB', '#8E7CCE', '#C27BA0'];
 
function highlightNames(target,background) {
  
    if (arguments.length == 0) {
    var ui = DocumentApp.getUi();
    var result = ui.alert('Highlight Names with basic color scheme', 'Hint: Case Sensitive\nKnown names: Caro, Flo, Gorg, Gzuz, Jarrod, Peter, Patrick, Tobi, Vali', ui.ButtonSet.OK_CANCEL);
    // Exit if user hit Cancel.
    //if (result.getSelectedButton() !== ui.Button.OK) return;
  }
  var doc = DocumentApp.getActiveDocument();
  var bodyElement = DocumentApp.getActiveDocument().getBody();
 
  for (var counter = 0; counter < namesList.length; counter+=1){
    target = namesList[counter];
    background = colors[counter];
    var searchResult = bodyElement.findText(target);
    while (searchResult !== null) {
      var thisElement = searchResult.getElement();
      var thisElementText = thisElement.asText();
 
      //Logger.log(url);
      thisElementText.setBackgroundColor(searchResult.getStartOffset(), searchResult.getEndOffsetInclusive(),background);
 
      // search for next match
      searchResult = bodyElement.findText(target, searchResult);
    }
  }
}
 
function highlightCells(target,background) {
 
    if (arguments.length == 0) {
    var ui = DocumentApp.getUi();
    var result = ui.alert('Highlight Names with basic color scheme', 'Hint: Case Sensitive\nKnown names: Caro, Flo, Gorg, Gzuz, Jarrod, Peter, Patrick, Tobi, Vali', ui.ButtonSet.OK_CANCEL);
    // Exit if user hit Cancel.
    //if (result.getSelectedButton() !== ui.Button.OK) return;
  }
  all_tables = DocumentApp.getActiveDocument().getBody().getTables();
    for (var counter = 0; counter < namesList.length; counter+=1){
      for (var i = 0; i < all_tables.length; i+=1){
      var num_rows = all_tables[i].getNumRows();
      for(var j = 0; j < num_rows; j+=1){
        var num_cols = all_tables[i].getRow(j).getNumChildren();
        for(var k = 0; k < num_cols; k+=1){
          if (all_tables[i].getCell(j,k).getText()==namesList[counter]){
            all_tables[i].getCell(j,k).setBackgroundColor(colors[counter]);
          }
        }  
      }
    }
  }
}
 
/**
 * Create custom menu when document is opened.
 */
function onOpen() {
  DocumentApp.getUi().createMenu('Custom GuSp')
      .addItem('Leiter:innen in Colors - Words', 'highlightNames')
      .addItem('Leiter:innen in Colors - Cells', 'highlightCells')
      .addToUi();
}

