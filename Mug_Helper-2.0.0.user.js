// ==UserScript==
// @name         Mug Helper
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Helps you not to do the same mistakes i did
// @author       Saint_Lucifer
// @match        https://www.torn.com/profiles.php*
// @icon         https://www.google.com/s2/favicons?domain=torn.com
// @connect      api.torn.com
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @updateURL    https://github.com/EmaNunes/torn-buy-mug-helper/raw/refs/heads/main/Mug%20Helper-1.0.0.user.js
// @downloadURL  https://github.com/EmaNunes/torn-buy-mug-helper/raw/refs/heads/main/Mug%20Helper-1.0.0.user.js
// ==/UserScript==

(function() {
    'use strict';

    var tornstats_api_key = "";
    var comment = "Mug Helper"

    const StorageKey = {
        tornstats_api_key: 'Mug_Helper.tornstats_api_key',
    };

    function delay(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
    function GetStorageEmptyIfUndefined(key) { return (localStorage[key] == undefined) ? "" : localStorage[key]; }
    function SetStorage(key, value) {try {localStorage[key] = value;} catch (e) { LogInfo("SetStorage method : " + e); }}
    function LogInfo(value) { var now = new Date(); console.log("%Mug Helper%c " + now.toISOString() + " - " + value, "font-size: 30px; font-weight: 400; color: #0096FF;","font-size: 12px;" );}

    async function loadKey(){
        tornstats_api_key = GetStorageEmptyIfUndefined(StorageKey.tornstats_api_key);
        if (tornstats_api_key == "" || tornstats_api_key == "null" ) {
            let redo=true;
            while (redo){
                redo = false;
                tornstats_api_key = prompt("Please insert your Torn API Key \n A public key is enough");
                if (tornstats_api_key != ""&& tornstats_api_key != null){

                    SetStorage(StorageKey.tornstats_api_key, tornstats_api_key);
                    LogInfo("TornStats_api_key Saved");
                    redo = false


                }else{
                    if (confirm("Want to insert API Key again ?")) { redo = true; }
                }
            }
        }
    }


    async function getCompanyData(id, key){
        var url;
        url = 'https://api.torn.com/company/'+id+'?selections=&key=' + tornstats_api_key+ '&comment='+comment;


        var resp = await fetch(url);
        var r = await resp.json();

        return r.company.company_type;
    }

    async function alertar(){
        alert("User have 75% mug protection");
    }

    async function getCompanyID() {

        const infoTable = document.querySelector('.info-table');
        if (!infoTable) {
            LogInfo('info-table not found');
            return null;
        }

        const listItems = infoTable.querySelectorAll('li');
        if (listItems.length < 4) {
            LogInfo('Expected at least 4 <li> elements in info-table');
            return null;
        }

        const fourthLi = listItems[3];
        const linkElement = fourthLi.querySelector('a');
        if (!linkElement) {
            LogInfo('Company link not found');
            return null;
        }

        // Extract the ID from the href attribute
        const href = linkElement.getAttribute('href');
        const idMatch = href.match(/ID=(\d+)/);

        if (!idMatch) {
            LogInfo('Company ID not found in the href attribute');
            return null;
        }

        return idMatch[1];
    }


    (async () => {
        loadKey();
        await delay(1000);
        const companyID = await getCompanyID();
        if (companyID) {

            const type = await getCompanyData(companyID, tornstats_api_key);
            if (type == 5){
                await alertar();
            }
        }

    })();
})();