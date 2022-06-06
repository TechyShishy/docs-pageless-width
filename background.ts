export {}

declare global {
    interface Window { nug: any; }
}

const narrow = 570;
const medium = 970;
const wide   = 1370;

const origNugString = "function nug(a){if(!a)return 770;switch($hd(a)){case 0:return 770;case 1:return 970;case 2:return 1170;default:return 770}}";

declare function $hd(a: boolean): number;

function domInjector(): void { 
    // Temp Safety:
    if (window.nug.toString() != origNugString) {
        return
    }
    window.nug = function customNug(a: boolean): number {
        if (!a)
            return narrow;
        switch ($hd(a)) {
            case 0:
                return narrow;
            case 1:
                return medium;
            case 2:
                return wide;
            default:
                return narrow;
        }
    }
}

function injectCustomNug(tabId: number): void {

        var scriptInjection: chrome.scripting.ScriptInjection = { 
            func: domInjector,
            target: { 
                frameIds: [0],
                tabId: tabId
            },
            world: "MAIN"
        }
        chrome.scripting.executeScript(scriptInjection)
}

function actionCallback(tab: chrome.tabs.Tab): void {
    if(!tab.id) {
        return
    }
    injectCustomNug(tab.id)
}
function webNavCallback(details: chrome.webNavigation.WebNavigationFramedCallbackDetails): void {
    if(!details.tabId){
        return
    }
    setTimeout(()=>{injectCustomNug(details.tabId)}, 2000)
}

var urlFilter: chrome.events.UrlFilter[] = [
    {
        hostEquals: "docs.google.com",
        pathPrefix: "/document/d/",
        pathSuffix: "edit"
    }
]

var filters: chrome.webNavigation.WebNavigationEventFilter = {
    url: urlFilter
}

chrome.action.onClicked.addListener(actionCallback)
chrome.webNavigation.onCompleted.addListener(webNavCallback, filters)