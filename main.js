const selectors = {
    mainLanguageTrigger: '.top-bar__current',
    languageChoiceBody: '.top-bar__languages',
    languageTrigger: '.top-bar__link'
}

const langaugeMapping = {
    'PL' : 'Polski',
    'CZ' : 'Čeština',
    'LT' : 'Lietuvių',
    'SK' : 'Slovenčina'
}

function fetchData(region) {
    region = region || 'PL';
    const url = 'https://app.satagro.pl/api/plans/?units=metric';
    const proxy = 'https://secret-ocean-49799.herokuapp.com';
    const regionParam = 'region=' + region;
    const urlOutput = proxy + '/' + url + '&' + regionParam;
    
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    fetch(urlOutput , {
        headers: headers,
    })
    .then(data => {
        return data.json();
    })
    .then(response => {
        let data = response;
        let source = document.getElementById("entry-template").innerHTML;
        let template = Handlebars.compile(source);
        let output = data.filter(element => {
            var test = element;
            return element.yearly_rate !== 0;
        });
        var html = template({output});
        $('body').append(html);
    })
}

function assignListeners() {

    $(selectors.mainLanguageTrigger).click(function () {
        $(selectors.languageChoiceBody).slideToggle();
    })

    $(selectors.languageTrigger).click(function () {
        let $chosenLanguage = $(this).data('region');
        let $mainLanugageElement = $(selectors.mainLanguageTrigger);
        let mappedLanguageValue = langaugeMapping[$chosenLanguage];
        
        $mainLanugageElement.text(mappedLanguageValue);
        $(selectors.languageChoiceBody).slideToggle()
        fetchData($chosenLanguage);
    })
}


function initializeApp() {
    assignListeners();
    fetchData();
}

$(document).ready(function () {
    initializeApp();
})
