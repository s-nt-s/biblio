import { InputString, FormField, SelectString } from "./form";



export class State {
    private static __instance: State | null = null;
    public readonly title = new InputString("#title", null, 't');
    public readonly author = new InputString("#author", null, 'a');
    public readonly format = new SelectString("#format", "epub", 'f');
    
    private readonly __onchange: EventListener[] = [];

    static getState() {
        if (State.__instance == null) {
            State.__instance = new State();
            State.__instance.__init();
        }
        return State.__instance;
    }

    private __getImputs() {
        const arr: FormField<any, any>[] = [];
        for (const v of Object.values(this)) {
            if (v instanceof FormField) {
                arr.push(v)
            }
        }
        return arr;
    }

    private __init() {
        window.addEventListener(
            "popstate",
            () => {this.toForm()}
        );
        this.toForm()
    }

    toForm() {
        this.__getImputs().forEach(i=>i.reset());
        const old = this.getQuerty()
        const qr = new URLSearchParams((new URL(document.location.href)).search);
        [
            this.title,
            this.author,
            this.format,
        ].forEach((i) => {
            const v = qr.get(i.qr);
            if(v!=null) return i.set(v);
        });
        const nw = this.getQuerty()
        if (old == nw) return;
        this.__onchange.forEach(f=>f(new Event("change")));
        
    }
    getQuerty() {
        const qr: string[] = [];
        [
            this.title,
            this.author,
            this.format,
        ].forEach((i) => {
            const v = i.get()
            if(v!=null) return qr.push(`${i.qr}=${v}`);
        });
        const query = qr.length==0?"":("?"+qr.join("&"));
        return query;
    }
    toQuerty() {
        const query = this.getQuerty();
        if (document.location.search == query) return;
        const url = document.location.href.replace(/\?.*$/, "");
        history.pushState({}, "", url + query);
    }

    getInputs() {
        return  [
            this.title.node,
            this.author.node,
        ]
    }
    onInputs(fnc: EventListener) {
        this.__addEventListener(
            fnc,
            ...this.getInputs()
        );
    }

    private __addEventListener(fnc: EventListener, ...nodes: (HTMLElement|null)[]) {
        const done = nodes.flatMap((i) => {
            if (i === null) return [];
            const e = i.getAttribute("type") == "checkbox" ? "click" : "change";
            i.addEventListener(e, fnc);
            return i;
        });
        if (done.length) this.__onchange.push(fnc);
    }
}