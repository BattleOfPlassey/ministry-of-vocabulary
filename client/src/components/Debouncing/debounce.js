export default (func, delay=300) => {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        // console.log("running debounce")
        if (typeof window !== "undefined") {
            window.clearTimeout(debounceTimer);
            debounceTimer
            = window.setTimeout(() => func.apply(context, args), delay);
        }
    };
};