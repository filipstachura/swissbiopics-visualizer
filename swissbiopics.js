var SwissBioPics;
(() => {
    "use strict";
    var e = {};
    (e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    })(e);
    const t = document.createElement("template");
    t.innerHTML = '<style>span.subcell_description {\n    padding-left: 0.5em;\n}\n\nul.subcell_present,\nul.notpresent {\n    list-style-type: none;\n    list-style: none;\n    padding: 0px;\n}\n\nul.subcell_present li::before {\n    content: "✓"\n}\n\nul.notpresent li::before {\n    content: "✗";\n}\n\n#swissbiopic {\n    display: grid;\n    grid-template-areas: "picture terms";\n    grid-template-columns: 1fr 1fr;\n    grid-column-gap: 10px;\n}\n\n.svg {\n    grid-area: picture;\n}\n\n.terms {\n    grid-area: terms;\n}\n</style><div id="swissbiopic"><div class="terms"></div></div>';
    class l extends HTMLElement {
        static anyNonOkIsAnError() {
            if (!response.ok) throw Error(response.statusText);
            return response
        }
        constructor() {
            super(), this.shadow = this.attachShadow({
                mode: "open"
            }), this.shadow.appendChild(t.content.cloneNode(!0)), this.wrapper = this.shadow.querySelector("#swissbiopic"), this.develop = null !== this.getAttribute("developer") && void 0 !== this.getAttribute("developer"), this.develop && console.log("in development mode"), this.sls = this.getAttribute("sls"), this.gos = this.getAttribute("gos"), this.taxid = this.getAttribute("taxid"), this.defaultItemTemplate = document.createElement("template");
            const e = document.createElement("li");
            this.defaultItemTemplate.appendChild(e);
            const l = document.createElement("a");
            l.className = "subcell_name";
            const s = document.createElement("span");
            s.className = "subcell_description", e.appendChild(l), e.appendChild(s)
        }
        render() {
            let e = fetch(((e, t, l, s) => {
                let n = "https://www.swissbiopics.org/";
                !0 === this.develop && (n = "http://localhost:8081/", console.log("developer", n));
                let i = `${n}/api/${t}/sl/${e}`;
                return null != l && (i = `${n}/api/${t}/go/${l}`), i
            })(this.sls, this.taxid, this.gos)).then(this.anyNonOkIsAnError).then((e => e.text())).then((e => this.wrapper.insertAdjacentHTML("beforeend", e)));
            this.liItemTemplate && (e = e.then((() => this.addListOfPresentSubcellularLocations(this.sls, this.wrapper, this.terms))).then((() => this.addListOfNotPresentSubcellularLocations(this.sls, this.wrapper, this.terms))).then((() => this.addListOfNotFoundSubcellularLocations(this.sls, this.wrapper, this.terms)))), e.then((() => this.addEventHandlers(this.wrapper, this.terms))).then((() => this.shadow.appendChild(this.wrapper))).then((() => this.shadow.dispatchEvent(new CustomEvent("svgloaded")))).catch((e => {
                this.showErrorMessageToUser(e, this.shadow), this.shadow.dispatchEvent(new CustomEvent("failedtoload"))
            }))
        }
        connectedCallback() {
            const e = "sibSwissBioPicsSlLiItem",
                t = document.getElementById(e);
            if (null !== t) this.liItemTemplate = t.content, this.terms = this.shadow.querySelector(".terms"), this.setAttribute("contentid", e);
            else if (null !== this.getAttribute("contentid")) {
                const e = document.getElementById(this.getAttribute("contentid"));
                null !== e ? (e.parentElement.removeChild(e), this.wrapper.appendChild(e), e.hidden = !1, this.terms = e) : (this.liItemTemplate = this.defaultItemTemplate.content, this.terms = this.shadow.querySelector(".terms"))
            } else this.liItemTemplate = this.defaultItemTemplate.content, this.terms = this.shadow.querySelector(".terms");
            const l = document.getElementById("sibSwissBioPicsStyle");
            if (null !== this.getAttribute("styleid")) {
                let e = document.getElementById(this.getAttribute("styleid")).content.cloneNode(!0);
                this.shadow.append(e)
            } else if (null !== l) {
                let e = l.content.cloneNode(!0);
                this.shadow.append(e)
            }
            const s = document.createElement("style");
            s.innerText = ".subcell_present li,\n.subcell_present path,\n.subcell_present circle,\n.subcell_present ellipse,\n.subcell_present polygon,\n.subcell_present rect,\n.subcell_present polyline,\n.subcell_present line {\n    fill: lightblue;\n    fill-opacity: .50;\n    background-color: lightblue;\n}\n\n.subcell_present ul.lookedAt,\n.subcell_present path.lookedAt,\n.subcell_present circle.lookedAt,\n.subcell_present ellipse.lookedAt,\n.subcell_present polygon.lookedAt,\n.subcell_present rect.lookedAt,\n.subcell_present polyline.lookedAt,\n.subcell_present line.lookedAt {\n    stroke: blue;\n    fill-opacity: .75;\n}\n\n.lookedAt {\n    stroke: orange;\n    fill: red;\n    fill-opacity: .25;\n    background-color: orange;\n}\n\n/*Cytoskeleton is special cased to not do a fill*/\n\n#SL0090 .lookedAt {\n    fill: none;\n}\n", this.shadow.append(s), this.render()
        }
        showErrorMessageToUser(e, t) {
            console.log(e), t.innerHTML = '<span class="failure">Failed to fetch a SwissBioPic, please try again later.</span>'
        }
        findAndSort(e, t) {
            const l = new Set;
            return Array.from(e.querySelectorAll(t)).sort(((e, t) => {
                let l = e.querySelector(":scope > .subcell_name"),
                    s = t.querySelector(":scope > .subcell_name");
                if (null !== l && null !== s) {
                    let e = l.textContent,
                        t = s.textContent;
                    return e.localeCompare(t)
                }
                return null != l ? 1 : null != s ? -1 : 0
            })).filter((e => {
                let t = e.querySelector(":scope > .subcell_name");
                if (null !== t) {
                    let e = t.parentElement.id;
                    return !l.has(e) && (l.add(e), !0)
                }
            }))
        }
        addListOfPresentSubcellularLocations(e, t, l) {
            let s = document.createElement("ul");
            s.className = "subcell_present";
            const n = this.findAndSort(t, ":scope svg .subcellular_location.subcell_present");
            for (let e of n) {
                let t = this.liItemTemplate.cloneNode(!0);
                s.appendChild(t);
                let l = s.lastElementChild,
                    n = l.querySelectorAll(":scope .subcell_name")[0];
                n.href = `https://www.uniprot.org/locations/${e.id.substring(2)}`, n.textContent = e.querySelector(":scope > .subcell_name").textContent, l.querySelectorAll(":scope .subcell_description")[0].textContent = e.querySelector(":scope > .subcell_description").textContent, l.id = `${e.id}term`, l.className = "subcell_present"
            }
            l.appendChild(s)
        }
        addListOfNotPresentSubcellularLocations(e, t, l) {
            let s = document.createElement("ul");
            s.className = "notpresent";
            const n = this.findAndSort(t, ":scope svg .subcellular_location:not(.subcell_present)");
            for (let e of n) {
                let t = this.liItemTemplate.cloneNode(!0);
                s.appendChild(t);
                let l = s.lastElementChild,
                    n = l.querySelectorAll(":scope .subcell_name")[0];
                n.href = `https://www.uniprot.org/locations/${e.id.substring(2)}`, n.textContent = e.querySelector(":scope > .subcell_name").textContent, l.querySelectorAll(":scope .subcell_description")[0].textContent = e.querySelector(":scope > .subcell_description").textContent, l.id = `${e.id}term`, l.className = "notpresent"
            }
            l.appendChild(s)
        }
        addListOfNotFoundSubcellularLocations(e, t, l) {
            if (null !== e) {
                let s = document.createElement("ul");
                s.className = "subcell_notfound";
                for (let l of e.split(",")) {
                    let e = "SL" + l.padStart(4, "0");
                    if (!t.querySelector("#" + e)) {
                        let t = this.liItemTemplate.cloneNode(!0);
                        s.appendChild(t), t = "subcell_notfound";
                        let n = s.lastElementChild,
                            i = n.querySelectorAll(":scope .subcell_name")[0],
                            o = n.querySelectorAll(":scope .subcell_name")[0];
                        i.href = `https://www.uniprot.org/locations/${l}`, i.textContent = e, n.id = `SL${l.padStart(4,"0")}term`, fetch(`https://sparql.uniprot.org/sparql?query=PREFIX+skos%3a+%3chttp%3a%2f%2fwww.w3.org%2f2004%2f02%2fskos%2fcore%23%3e%0d%0aPREFIX+rdfs%3a+%3chttp%3a%2f%2fwww.w3.org%2f2000%2f01%2frdf-schema%23%3e%0d%0aSELECT+%3flabel+%3fcomment+%0d%0aWHERE++%7b%0d%0a%09%3chttp%3a%2f%2fpurl.uniprot.org%2flocations%2f${l}%3e+skos%3aprefLabel+%3flabel+%3b+rdfs%3acomment+%3fcomment+.%0d%0a%7d&format=srj`).then((e => e.json())).then((e => this.injectNameAndDescription(e, i, o)))
                    }
                }
                l.appendChild(s)
            }
        }
        injectNameAndDescription(e, t, l) {
            t.textContent = e.results.bindings[0].label.value, l.textContent = e.results.bindings[0].comment.value
        }
        addEventHandlers(e, t) {
            const l = "path, circle, ellipse, polygon, rect, polyline, line";
            for (let s of e.querySelectorAll(":scope svg .subcellular_location")) {
                for (let e of s.querySelectorAll(`:scope ${l}`)) e.addEventListener("mouseenter", (e => this.highLight(e, s, l))), e.addEventListener("mouseleave", (e => this.removeHiglight(e, s, l)));
                if (s.id) {
                    let e = t.querySelector(`:scope #${s.id}term`);
                    null !== e && (e.addEventListener("mouseenter", (e => this.highLight(e, s, l))), e.addEventListener("mouseleave", (e => this.removeHiglight(e, s, l))), e.addEventListener("touchstart", (e => this.highLight(e, s, l)), {
                        passive: !0
                    }), e.addEventListener("touchend", (e => this.removeHiglight(e, s, l)), {
                        passive: !0
                    }))
                }
            }
        }
        highLight(e, t, l) {
            const s = t.querySelector(".subcell_name");
            s.setAttribute("visibility", "visible"), s.setAttribute("x", "0"), s.setAttribute("y", "1em");
            const n = t.querySelector(".subcell_description");
            n.setAttribute("visibility", "visible"), n.setAttribute("x", "0"), n.setAttribute("y", "2em"), n.setAttribute("width", "20em");
            for (let e of t.querySelectorAll(l)) e.classList.add("lookedAt");
            let i = this.shadow.getElementById(`${t.id}term`);
            null !== i && i.classList.add("lookedAt")
        }
        removeHiglight(e, t, l) {
            t.querySelector(".subcell_name").setAttribute("visibility", "hidden"), t.querySelector(".subcell_description").setAttribute("visibility", "hidden");
            for (let e of t.querySelectorAll(l)) e.classList.remove("lookedAt");
            let s = this.shadow.getElementById(`${t.id}term`);
            null !== s && s.classList.remove("lookedAt")
        }
    }
    window.customElements.get("sib-swissbiopics-sl") || window.customElements.define("sib-swissbiopics-sl", l), SwissBioPics = e
})();
