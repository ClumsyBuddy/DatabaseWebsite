const MasterLogger = require("./MasterLogger");




class Log{
    /**
     * 
     * @param {MasterLogger} MLogger 
     * @param {string} Name 
     */
    constructor(MLogger, Name){
        this.Control = MLogger;
        this.logger_name = Name;
        this.Logs = [];
    }

    New(Message){ //Possibly add email and IP
        var LogMessage = `${this.logger_name}": " ${Message} @ ${Date.now()}` //Create a string containing the name of the log, the Message, the unix time
        this.Logs.push(LogMessage);
    }

    Post(){
        if(this.Logs.length == 0){
            return;
        }
        this.Control.AddLog(this.Logs);
        this.Logs = [];
        
    }
    loadingTimer = setInterval(() => {
       this.Post();
    }, 100);
}


module.exports = Log;