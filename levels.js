const TITLE_PREFIX = "virtual_bronus"

Levels.one = {};
Levels.one.title = "one";
Levels.one.channelInit = [0]
Levels.one.load = function () {};
Levels.one.update = function (value, index)
{
  this.channels[index].output(value);
  if(this.channels[0].outputs[0] == 1)
  {
    gamestate.win();
  }
};

Levels.code = {};
Levels.code.title = "code";
Levels.code.channelInit = [5, 3, 8, 10];
Levels.code.load = function () {};
Levels.code.update = function (value, index)
{
  if (index != 3)
  {
    this.channels[index].output(this.channels[index].outputs[0]);
  }
  else
  {
    this.channels[index].output(value);
    if
    (
      this.channels[index].outputs[0] == 8
      && this.channels[index].outputs[1] == 3
      && this.channels[index].outputs[2] == 5)
    {
      gamestate.win();
    }
  }
}

Levels.mirror = {};
Levels.mirror.title = "mirror";
Levels.mirror.channelInit = [10, 10, 10, 10, 10, 10, 10, 10];
Levels.mirror.load = function () {};
Levels.mirror.update = function (value, index)
{
  if (index == 0) {
    this.channels[3].output(value+1);
  }
  else if (index == 1) {
    this.channels[2].output(value+1);
  }
  else if (index == 2) {
    this.channels[1].output(value-1);
  }
  else if (index == 3) {
    this.channels[0].output(value-1);
  }
  else if (index > 3)
  {
    this.channels[index].output(value);
  }

  if(
    (this.channels[0].outputs[0] == (this.channels[7].outputs[0]-1))
    && (this.channels[1].outputs[0] == (this.channels[6].outputs[0]-1))
    && (this.channels[2].outputs[0] == (this.channels[5].outputs[0]-1))
    && (this.channels[3].outputs[0] == (this.channels[4].outputs[0]-1)))
  {
    gamestate.win();
  }

};
