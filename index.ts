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

Alpine.data("day", () => ({
    date: new Date(), 
    day: null, 
    loading: true,
    init() {
        this.fetchDay();
        this.updateInterval = setInterval(() => { this.date = new Date(); this.fetchDay() }, 1 * 60 * 60 * 1000)
    },
    async fetchDay() {
        this.loading = true;
        const query = new DayQuery(this.date)
        const req = await request("https://api.purplegrey.today/graphql", query.query) 
        this.day = req.getDay.type;
        this.loading = false;
    }   
}))

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