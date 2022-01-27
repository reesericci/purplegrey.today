// @ts-ignore
import { Datepicker } from 'vanillajs-datepicker';
import Alpine from 'alpinejs'
import AlpineInstance from 'alpinejs';
import { request, gql, RequestDocument } from 'graphql-request'

interface DayQueryInterface {
    query: RequestDocument
}
class DayQuery implements DayQueryInterface {
    query: RequestDocument;
    constructor(date: Date) {
        this.query = gql`
        {
            getDay(day: ${date.getDate()}, month: ${date.getMonth() + 1}, year: ${date.getFullYear()}) {
            type
            }
        }
        `
    }
}

declare global {
    interface Window {
       Alpine: typeof AlpineInstance
    }
}

window.Alpine = Alpine
 

Alpine.store("functions", {
    genDayQuery(date: Date) {return new DayQuery(date)},
    async fetchDay(query: DayQueryInterface) { 
        const req = await request("https://api.purplegrey.today/graphql", query.query) 
        return req;
    }
})

Alpine.start()

const datepicker = new Datepicker(document.getElementById("calendar").childNodes[1], {
    autohide: true
});
document.getElementById("calendar").childNodes[1].addEventListener("hide", () => {
    document.getElementById("calendar").dispatchEvent(new Event("picked"))
})

document.getElementById("calendar").addEventListener("submit", (e) => {
    e.preventDefault()
    console.log(e)
})
