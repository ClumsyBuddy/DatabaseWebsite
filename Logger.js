

class MasterLogger{
    constructor(){
        this.LogItems = [];
    }

    AddLog(Log){
        this.LogItems.push(Log);
    }



}





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
        var LogMessage = `${this.logger_name}":" ${Message} @ ${Date.now()}` //Create a string containing the name of the log, the Message, the unix time
        this.Logs.push(LogMessage);
    }

    Post(){
        this.Control.AddLog(this.Logs);
        this.Logs = [];
    }

}