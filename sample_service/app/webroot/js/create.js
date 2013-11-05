// Generated by CoffeeScript 1.6.3
var editEnemyProgram, editPlayerProgram, executeProgram, getContentWindow, getCurrentProgram, getEnemyProgram, getPlayerProgram, loadProgram, loadProgramById, programStorage, saveProgram, showEnemyProgram, showPlayerProgram, stopProgram;

programStorage = new ProgramStorage();

getPlayerProgram = function() {
  return Game.instance.octagram.getInstance(Game.instance.currentScene.world.playerProgramId);
};

getEnemyProgram = function() {
  return Game.instance.octagram.getInstance(Game.instance.currentScene.world.enemyProgramId);
};

getCurrentProgram = function() {
  return Game.instance.octagram.getCurrentInstance();
};

showPlayerProgram = function() {
  return Game.instance.octagram.showProgram(Game.instance.currentScene.world.playerProgramId);
};

showEnemyProgram = function() {
  return Game.instance.octagram.showProgram(Game.instance.currentScene.world.enemyProgramId);
};

editPlayerProgram = function() {
  $('#edit-player-program').hide();
  $('#edit-enemy-program').show();
  $('#program-container').css('border-color', '#5cb85c');
  return showPlayerProgram();
};

editEnemyProgram = function() {
  $('#edit-player-program').show();
  $('#edit-enemy-program').hide();
  $('#program-container').css('border-color', '#d9534f');
  return showEnemyProgram();
};

saveProgram = function(override) {
  if (override == null) {
    override = false;
  }
  return programStorage.saveProgram(override);
};

loadProgram = function() {
  return programStorage.loadProgram();
};

loadProgramById = function(id, callback) {
  return programStorage.loadProgramById(id, callback);
};

getContentWindow = function() {
  return $('iframe')[0].contentWindow;
};

executeProgram = function() {
  getPlayerProgram().execute();
  return getEnemyProgram().execute();
};

stopProgram = function() {
  getPlayerProgram().stop();
  return getEnemyProgram().stop();
};
