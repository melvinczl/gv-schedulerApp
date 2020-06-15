/**
 * Creates a basic clock and binds it to a specified element
 */
class Clock {
    timeTemplate: string = "00:00:00";
    clockHandler: number;
    target: HTMLElement;

    /**
     * @return string, time
     */
    getTime() {
        var date = new Date();
        return [date.getHours(), date.getMinutes(), date.getSeconds()]
            .map(current => current >= 10 ? current : "0" + current).join(":");
    }

    /**
     * Starts the clock
     */
    start(): void {
        /*
        I use the bind method to specify the "this" for interval's callback, because
        interval runs on a seperate execution context, and so the keyword this, 
        initialy refers to the window object.
        */
        this.clockHandler = setInterval(function (parent) {
            this.target.innerHTML = this.getTime();
        }.bind(this), 1000);
    }

    /**
     * Stops the clock by stoping the clock's interval
     */
    stop(): void {
        clearInterval(this.clockHandler);
    }

    /**
     * Binds the Clock to specified element's content
     * @param elem
     */
    bindTo(elem): void {
        this.target = elem;
        this.target.innerHTML = this.timeTemplate;
    }
}

(function (window, document) {
    var clock = new Clock();

    clock.bindTo(document.getElementById("clock"));
    clock.start();
} (window, document));