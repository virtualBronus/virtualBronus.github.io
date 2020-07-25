var Levels = {};

function Level(levelInitObj)
{
    this.channelInit = levelInitObj.channelInit;
    this.title = levelInitObj.title;
    this.logic = []
    this.logic.update = levelInitObj.update;
    this.logic.load = levelInitObj.load;

    this.logic.load();

    this.input = function (inputValue, channelIndex)
    {
      if((channelIndex < gamestate.channels.length) && (channelIndex >= 0))
      {
          gamestate.channels[channelIndex].input(inputValue);
          this.logic.update(inputValue, channelIndex);
          for(i = 0; i < gamestate.channels.length; ++i)
          {
            gamestate.channels[i].update();
          }
      }
    };

    this.end = function ()
    {
      var temp1 = this.logic.update;
      var temp2 = this.logic.load;
      this.logic = [];
      this.logic.update = temp1;
      this.logic.load = temp2;
    };

    this.bindChannels = function ()
    {
      this.logic.channels = gamestate.channels;
    };
}









function Channel(channelIndex, initialValue, type)
{
    this.index = channelIndex;
    this.selected = false;

    this.inputs = [];
    this.outputs = [];
    if (initialValue <= 9 && initialValue >= 0)
    {
      this.outputs.push(initialValue)
    }
    else
    {
      this.outputs.push("_")
    }

    this.div = document.createElement("div");
      this.div.setAttribute("id", this.index);
      this.div.classList.add("channel");
      if (type == 1)
      {
        this.div.classList.add("top");
      }
      else if (type == 2)
      {
        this.div.classList.add("bottom");
      }
      else if (type == 3)
      {
        this.div.classList.add("top");
        this.div.classList.add("bottom");
      }
      document.getElementById("channel_container").appendChild(this.div);

    this.paragraph = document.createElement("p");
      this.paragraph.classList.add("channel_text");
      this.div.appendChild(this.paragraph);

    this.div.onclick = function()
    {
      if(gamestate.channels[this.id].selected)
      {
        gamestate.selectChannel(-1);
      }
      else
      {
        gamestate.selectChannel(this.id);
      }
    };

    this.update = function()
    {
      var lastOutput = "";
      var lastInput = "";
      var bStart = "";
      var bEnd = "";

      if(this.selected)
      {
        bStart = "<b>";
        bEnd = "</b>";
      }


      if(this.outputs[1] || (this.outputs[1] == 0))
      {
        lastOutput =
        "<span class='channel_last_output'>"
        + this.outputs[1]
        + "⇒</span>";
      }

      if(this.inputs[0] || (this.inputs[0] == 0))
      {
        lastInput =
        "<span class='channel_last_input'>"
        + bStart + "<< " + this.inputs[0] + bEnd
        + "</span>";
      }

      var channelDisplay
        = lastOutput + bStart + this.outputs[0] + bEnd + lastInput;
      this.paragraph.innerHTML = channelDisplay;

    };

    this.update();

    this.input = function(inputValue)
    {
      this.inputs.unshift(inputValue);
    };

    this.output = function(outputValue)
    {
      this.outputs.unshift(outputValue);
    };

    this.destroy = function()
    {
      this.paragraph.remove();
      this.div.remove();
    };

    this.setSelectStatus = function(willBeSelected)
    {
      if(willBeSelected)
      {
        this.selected = true;
        this.div.classList.add("selected");
      }
      else
      {
        this.selected = false;
        this.div.classList.remove("selected");
      }
      this.update();
    }
}








var gamestate =
{
  currentLevel: null,
  selectedChannel: -1,
  queue: [],
  channels: [],
  winInterim: false,

  loadLevel: function(level)
  {
    if(this.currentLevel)
    {
      this.endLevel();
    }
    this.currentLevel = level;
    for (i=0; i < this.currentLevel.channelInit.length; ++i)
    {
        var type = 0;
        if (i == 0)
        {
          type = 1;
        }
        if (i == (this.currentLevel.channelInit.length - 1))
        {
          type = type + 2;
        }
        var c = new Channel(i, this.currentLevel.channelInit[i], type);
        this.channels.push(c);
    }
    this.currentLevel.bindChannels();
    document.getElementById("title").innerHTML =
      TITLE_PREFIX + "." + this.currentLevel.title;
  },

  handleInput: function(e)
  {
    //document.getElementById("title").innerHTML = e.key;
    if((e.key == "1") || (e.key == "2") || (e.key == "3") || (e.key == "4")
      || (e.key == "5") || (e.key == "6") || (e.key == "8") || (e.key == "9")
      || (e.key == "0") || (e.key == "7"))
    {
      gamestate.currentLevel.input(parseInt(e.key), gamestate.selectedChannel);
      //document.getElementById("title").innerHTML = e.key;
    }
  },

  setLevelQueue: function(levelArray)
  {
    this.queue = levelArray;
    this.currentLevelIndex = 0;
    this.loadLevel(this.queue[this.currentLevelIndex]);
  },

  nextLevel: function()
  {
    if((this.queue.length > 0) && (this.queue.length-1 > this.currentLevelIndex))
    {
      ++this.currentLevelIndex;
      this.loadLevel(this.queue[this.currentLevelIndex]);
    }
  },

  selectChannel: function(channelIndex)
  {
    if(this.winInterim == false)
    {
      this.selectedChannel = -1;
      for(i = 0; i < this.channels.length; ++i)
      {
        var status = false;
        if (i == channelIndex)
        {
          this.selectedChannel = i;
          status = true;
        }
        this.channels[i].setSelectStatus(status);
      }
    }
    if(this.currentLevel.logic.channels[channelIndex])
    {
      console.log("true")
    }
    else
    {
      console.log("false")
    }
  },

  endLevel: function()
  {
    for(i = 0; i < this.channels.length; ++i)
    {
        this.channels[i].destroy();
    }
    this.channels = [];
    this.currentLevel.end();
    this.selectedChannel = -1;
  },

  win: function(level)
  {
    this.selectChannel(-1);
    this.winInterim = true;
    var title = document.getElementById("title");
    title.innerHTML = TITLE_PREFIX + ".next()";
    title.classList.add("win");
    title.onclick = function()
    {
      var title = document.getElementById("title");
      gamestate.winInterim = false;
      gamestate.nextLevel();
      title.onclick = function() {};
      title.classList.remove("win");
    };
  }
}

function init()
{
  babbo = new Level(Levels.one);
  gabbo = new Level(Levels.code);
  yabbo = new Level(Levels.mirror)
  gamestate.setLevelQueue([babbo, gabbo, yabbo]);
  document.addEventListener("keydown", gamestate.handleInput);
}
