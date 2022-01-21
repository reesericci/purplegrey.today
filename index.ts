// @ts-ignore
import { Datepicker } from 'vanillajs-datepicker';
import Alpine from 'alpinejs'
import AlpineInstance from 'alpinejs';
declare global {
    interface Window {
       Alpine: typeof AlpineInstance
    }
}

window.Alpine = Alpine
 
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
