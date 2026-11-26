import './style.css'
import { onReady, onAction, getElement, getDomName, getDom } from './util';
import { State } from './state'
import { type Book } from './model'

const TARGET = import.meta.env.VITE_BACKEND;

onReady(() => {
  const state = State.getState();
  state.toForm();
  doSearch();
  onAction(
    "#search",
    function(e: Event) {
      e.preventDefault();
      doSearch();
    }
  );
  document.querySelectorAll<HTMLInputElement>(
    'input[type="text"]'
  ).forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        doSearch();
      }
    });
  });
})

function doSearch() {
    const t = getElement("search", HTMLButtonElement);
    if (t==null) return;
    t.disabled = true;
    t.textContent="Buscando...";
    const r = _doSearch();
    const doDone = () => {
      t.textContent="Buscar";
      t.removeAttribute("disabled");
      State.getState().toQuerty();
    }
    if (r == null) doDone();
    else {
      r.finally(() => doDone());
    }

}

function _doSearch() {
  const div = getElement("results", HTMLDivElement);
  if (div == null) return;
  div.innerHTML = "";
  const state = State.getState()
  const title = state.title.get();
  const author = state.author.get();
  const format = state.format.get();
  if (title == null && author == null) {
    return;
  }
  const qr = ["lang=spa"];
  if (title) qr.push('title='+encodeURI(title));
  if (author) qr.push('author='+encodeURI(author));
  if (format) qr.push('format='+encodeURI(format));
  const url = TARGET + "?" + qr.join("&");
  return fetch(url).then(r=>r.json()).then(data=>{
    if (!Array.isArray(data)) return;
    div.insertAdjacentHTML('beforeend', `
      <p id="count">${data.length} resultado${data.length==1?'':'s'}</p>
    `);
    data.forEach((x: Book) => {
      const imgs: string[] = [];
      x.source.forEach(x=>{
        imgs.push(`
          <figure>
            <a href="${x.url}"><img src="${x.cover}" alt="${getDom(x.url)}"/></a>
            <figcaption><a href="${x.url}">${getDomName(x.url)}</a></figcaption>
          </figure>
        `);
      })
      const aTxt = x.author.length?`<small class="author">(${x.author.join(" - ")})</small>`:"";
      div.insertAdjacentHTML('beforeend', `
        <h1 class="title">${x.title}${aTxt}</h1>
        <p class="description">${x.description}</p>
        <div class="cover">
        ${imgs.join('\n')}
        </div>
      `);
    });
  });
}