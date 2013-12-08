getCurrentProgram = () -> Game.instance.octagram.getCurrentInstance()

class JsCodeViewer
  constructor: () ->
    @editor = null
    @preCursor = null

  show: (lines) ->
    text = (line.text for line in lines)
    code = text.join('\n')

    @editor = ace.edit('js-viewer')
    @editor.getSession().setMode("ace/mode/javascript");
    @editor.getSession().setValue(code)

    selection = @editor.getSelection()
    selection.on('changeCursor', () => 
      @changeHighlite(@editor.getCursorPosition(), lines)
    ) 

    @editor.setReadOnly(true)

  hide: (lines) ->
    for line in lines
      @unHighliteLine(line)

    @editor.destroy()

  changeHighlite: (pos, lines) ->
    if @preCursor? then @unHighliteLine(lines[@preCursor.row])
    @highliteLine(lines[pos.row])

    @preCursor = pos

  highliteLine: (line) ->
    if line.node?
      for n in line.node then n.showExecutionEffect()

  unHighliteLine: (line) ->
    if line.node? 
      for n in line.node then n.hideExecutionEffect()

class Frontend 
  constructor: (@options) ->
    @programStorage = new ProgramStorage()
    @playerRunning = false
    @enemyRunning = false

    @currentProgramName = "";

    @viewer = null
    
  getPlayerProgram : () -> Game.instance.octagram.getInstance(Game.instance.currentScene.world.playerProgramId)
  getEnemyProgram : () -> Game.instance.octagram.getInstance(Game.instance.currentScene.world.enemyProgramId)

  showPlayerProgram : () -> Game.instance.octagram.showProgram(Game.instance.currentScene.world.playerProgramId)
  showEnemyProgram : () -> Game.instance.octagram.showProgram(Game.instance.currentScene.world.enemyProgramId)
  
  resetProgram : (onReset) ->
    @stopProgram()
  
    restart = () -> 
      if (!@playerRunning && !@enemyRunning) 
        Game.instance.currentScene.restart()
        if onReset then onReset()
      else setTimeout(restart, 100)
  
    setTimeout(restart, 100)
  
  restartProgram : () ->
    @resetProgram(() => 
      @executeProgram())
  
  editPlayerProgram : () ->
    $('#edit-player-program').hide()
    $('#edit-enemy-program').show()
    $('#program-container').css('border-color', '#5cb85c')
  
    @showPlayerProgram()
  
  editEnemyProgram : () ->
    $('#edit-player-program').show()
    $('#edit-enemy-program').hide()
    $('#program-container').css('border-color', '#d9534f')
  
    @showEnemyProgram()
  
  saveProgram : (override = false) -> 
    @programStorage.saveProgram(override, @currentProgramName, (data) => 
      @currentProgramName = data.name
    )

  deleteProgram : () ->
    @programStorage.deleteProgram()

  loadProgram : () -> 
    @programStorage.loadProgram((data) => 
      @currentProgramName = data.name
    )

  loadProgramById : (id, callback) -> @programStorage.loadProgramById(id, callback)
  
  getContentWindow : () -> $('iframe')[0].contentWindow
  
  executeProgram : () ->
    @playerRunning = true
    @enemyRunning = true
  
    onStop = () => @options.onStop() if !@playerRunning && !@enemyRunning && @options? && @options.onStop?

    @getPlayerProgram().execute({
      onStop: () => 
        @playerRunning = false
        onStop()
    })
    @getEnemyProgram().execute({
      onStop: () => 
        @enemyRunning = false
        onStop()
    })
  
  stopProgram : () ->
    @getPlayerProgram().stop()
    @getEnemyProgram().stop()

  getPlayerCode: () ->
    instance = @getPlayerProgram()
    generator = new JsGenerator()
    generator.generate(instance.cpu)

  showJsWithDialog: () ->
    lines = @getPLayerCode()

    template = 
      '<html>' +
      '<head>' + 
      '</head>' +
      '<body>' +
      '<div id="editor-div" style="height: 500px; width: 500px"></div>' +
      '</body>' + 
      '</html>'

    viewer = new JsCodeViewer()
    bootbox.alert(template, () -> viewer.hide(lines))

    viewer.show(lines)

  showJs: () ->
    lines = @getPlayerCode()

    $('#enchant-stage').hide()
    $('#js-viewer').show()

    @viewer = new JsCodeViewer()
    @viewer.show(lines)

  hideJs: () ->
    lines = @getPlayerCode()
    
    @viewer.hide(lines)

    $('#enchant-stage').show()
    $('#js-viewer').remove()

    $('#program-container').append($('<div id="js-viewer"></div>'))

$ ->
  frontend = new Frontend({
    onStop: () ->
      # $('#run').removeAttr('disabled')
      # $('#stop').attr('disabled', 'disabled')
      # $('#restart').attr('disabled', 'disabled')
  })

  $('#edit-player-program').click(() =>
    $('#target-label-enemy').hide()
    $('#target-label-player').show()
    $('#save').removeAttr('disabled')
    frontend.editPlayerProgram()
  )

  $('#edit-enemy-program').click(() =>
    $('#target-label-enemy').show()
    $('#target-label-player').hide()
    $('#save').attr('disabled', 'disabled')
    frontend.editEnemyProgram()
  )

  $('#save').click(() => frontend.saveProgram())
  $('#load').click(() => frontend.loadProgram())
  $('#delete').click(() => frontend.deleteProgram())

  $('#run').click(() =>
    frontend.executeProgram()
    $('#run').attr('disabled', 'disabled')
    $('#stop').removeAttr('disabled')
    $('#restart').removeAttr('disabled')
  )

  $('#stop').click(() =>
    frontend.resetProgram()
    $('#run').removeAttr('disabled')
    $('#stop').attr('disabled', 'disabled')
    $('#restart').attr('disabled', 'disabled')
  )

  $('#restart').click(() => frontend.restartProgram())

  $('#show-js').click(() => 
    $('#show-js').attr('disabled', 'disabled')
    $('#hide-js').removeAttr('disabled')
    frontend.showJs()
  )
  $('#hide-js').click(() => 
    $('#hide-js').attr('disabled', 'disabled')
    $('#show-js').removeAttr('disabled')
    frontend.hideJs()
  )
