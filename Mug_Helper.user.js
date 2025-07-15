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
// @updateURL    https://github.com/EmaNunes/torn-buy-mug-helper/raw/refs/heads/main/Mug_Helper.user.js
// @downloadURL  https://github.com/EmaNunes/torn-buy-mug-helper/raw/refs/heads/main/Mug_Helper.user.js
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
            ShowDiv();
        }
    }

    async function savekey(){
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
        if (tornstats_api_key == "" || tornstats_api_key == "null" ) {return}
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



function ShowDiv() {
    // Create the overlay div
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
    `;

    // Create the modal div
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        z-index: 1001;
        width: 80%;
        max-width: 600px;
        text-align: center;
        color:black;
    `;

// Add text content in separate lines
    const textContainer = document.createElement('div');
    textContainer.style.cssText = `text-align: center;`;

    const line1 = document.createElement('p');
    line1.textContent = 'A configuration Key for Mug-Helper Script was not found.';
    textContainer.appendChild(line1);

    const line2 = document.createElement('p');
    line2.textContent = 'Description of the script:';
    line2.style.cssText = ` margin-top: 15px; margin-bottom:15px;`;
    textContainer.appendChild(line2);


    const line2Part2 = document.createElement('p');
    line2Part2.textContent = ' This script "Mug-Helper" when any profile page load, will look the link of the company displayed in the profile page and then use the id of the company found in the link and the a public access key provided by the user to make a api request about the company. Then it will evaluate the result to check if the company is a Clothing store and alerts the player that the user have 75% mug protection';
    line2Part2.style.cssText = ` margin-bottom: 15px; `;
    textContainer.appendChild(line2Part2);

    const line3 = document.createElement('p');
    const link = document.createElement('a');
    link.href = 'https://www.torn.com/preferences.php#tab=api?step=addNewKey&title=mug-helper&company=companies';
    link.textContent = 'Click here to generate the key for Mug-Helper (public one)';
    link.style.cssText = `color: #0066cc; text-decoration: underline;`;
    link.target = '_blank';
    line3.appendChild(link);
    textContainer.appendChild(line3);

    modal.appendChild(textContainer);

    // Add the HTML table
    const table = document.createElement('table');
    table.innerHTML = `
        <tr>
            <th>Data Storage</th>
            <th>Data Sharing</th>
            <th>Purpose of Use</th>
            <th>Key Storage & Sharing</th>
            <th>Key Access Level</th>
        </tr>
        <tr>
            <td>Will the data be stored for any purpose?</td>
            <td>Who can access the data besides the end user?</td>
            <td>What is the stored data being used for?</td>
            <td>Will the API key be stored securely and who can access it?</td>
            <td>What key access level or specific selections are required?</td>
        </tr>
        <tr>
            <td>Only locally</td>
            <td>Nobody</td>
            <td>Not eligible - only end user has access</td>
            <td>Stored locally / Not shared</td>
            <td>Public Access</td>
        </tr>
    `;
    table.style.cssText = `
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
    `;
    table.querySelectorAll('th, td').forEach(cell => {
        cell.style.cssText = 'border: 1px solid #ddd; padding: 8px; text-align: left;';
    });
    modal.appendChild(table);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.cssText = `
        margin-top: 15px;
        padding: 10px 20px;
        background-color: #ff4444;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    closeButton.onclick = () => {
        document.body.removeChild(overlay);
        document.body.removeChild(modal);
    };

// Add Config Key button
    const configButton = document.createElement('button');
    configButton.textContent = 'Config Key';
    configButton.style.cssText = `
        margin-top: 10px;
        margin-right: 20px;
        padding: 10px 20px;
        background-color: #0096FF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    `;
    configButton.onclick = () => {
        savekey(); // Invoca a função savekey
    };
    modal.appendChild(configButton);



    modal.appendChild(closeButton);

    // Append elements to body
    document.body.appendChild(overlay);
    document.body.appendChild(modal);
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
