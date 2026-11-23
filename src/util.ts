export function onReady(fn: () => void) {
    if (document.readyState === "complete" || document.readyState === "interactive") {
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
export function onAction(
    slc: string,
    fn: (this: Element, event: Event) => any
) {
    document.querySelectorAll(slc).forEach(i=>{
        i.addEventListener(
            i.tagName === "BUTTON"? "click":"change",
            fn
        )
    })
}

export function getElement<T extends HTMLElement>(
    id: string,
    tp: new (...args: any[]) => T
): T | null {
    const e = document.getElementById(id);
    if (e == null) return null;
    if (!(e instanceof tp)) return null;
    return e;
}
export function getVal(
    id: string,
): string | null {
    const e = getElement(id, HTMLElement);
    if (e == null) return null;
    if (
        (e instanceof HTMLInputElement) ||
        (e instanceof HTMLSelectElement)
     ) return e.value;
     return null;
}

export function simplify(a: string) {
    a = a.toLocaleLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, " ")
        .trim();
    return a;
}

export function like(a: string | string[] | readonly string[], b: string | string[] | readonly string[]) {
    if (Array.isArray(a)) {
        for (let i=0; i<a.length; i++) if (like(a[i], b)) return true;
    }
    if (Array.isArray(b)) {
        for (let i=0; i<b.length; i++) if (like(a, b[i])) return true;
    }
    if (typeof a != "string") return false;
    if (typeof b != "string") return false;
    a = simplify(a);
    b = simplify(b);
    if (a.indexOf(b)!=-1) return true;
    if (b.indexOf(a)!=-1) return true;
    return false;
}

export function getDom(url: string) {
    url = url.toLocaleLowerCase().trim();
    let dom = url.replace(/^https?:\/\/(www\.)?/, "");
    dom = dom.replace(/\/.*/, "");
    return dom;
}