interface Time {
    /** Get current timestamp. */
    (): uint;
}

var t: Time = <Time>((): uint => Date.now());

export = t;

