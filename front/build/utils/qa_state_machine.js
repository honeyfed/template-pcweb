const readline = require("readline");

class QASM {
  constructor() {
    this.endCallback = null;
    this.errorCallback = null;
    this.statesConfig = null;
  }

  stateTransitionHandler(stateConfig, next) {
    let stateName = stateConfig.name;
    let stateDesc = stateConfig.desc;
    let stateInfo = stateName + ": " + stateDesc;
    let question = stateConfig.handler.bind(stateConfig.context)(
      stateConfig.data || void 0
    );
    let rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.question([stateInfo, question].join("  ===>  "), input => {
      rl.close(); // close created interface
      let ans = input || "NA";
      if (!stateConfig.state_transition[ans]) {
        ans = "NA";
      }
      let nextState = stateConfig.state_transition[ans];
      if (nextState === void 0) {
        nextState = stateConfig.state_transition["ANY"];
      }
      let code = next.bind(this)(stateConfig, nextState, input);
      if (code === 0) {
        this.endCallback && this.endCallback(code);
      }
      if (code === -1) {
        this.errorCallback &&
          this.errorCallback(
            code,
            "Not found this state whoes state ID is  " +
              stateConfig.state_transition[ans]
          );
      }
    });
  }

  stateTransiton(lastStateConfig, nextSate, lastInput) {
    if (nextSate === "END" || !nextSate) {
      // end
      return 0;
    }
    let nextStateConfig = this.getNextStateConfig(nextSate);
    if (!nextStateConfig) {
      return -1;
    }
    nextStateConfig.data = nextStateConfig.data || {};
    nextStateConfig.data.input = lastInput;
    this.stateTransitionHandler(nextStateConfig, this.stateTransiton);
  }

  getNextStateConfig(state) {
    for (let i = 0; i < this.statesConfig.length; i++) {
      let stateConfig = this.statesConfig[i];
      if (stateConfig.state === state) {
        return stateConfig;
      }
    }
    return null;
  }

  run(stateConfig, endCallback, errorCallback) {
    this.statesConfig = stateConfig;
    this.endCallback = endCallback;
    this.errorCallback = errorCallback;
    let initState = this.statesConfig[0];
    this.stateTransitionHandler(initState, this.stateTransiton);
  }
}

module.exports = QASM;
