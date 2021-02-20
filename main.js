const selectors = {
    mainLanguageTrigger: '.top-bar__current',
    languageChoiceBody: '.top-bar__languages',
    languageTrigger: '.top-bar__link'
}

const langaugeMapping = {
    'PL' : {language: 'Polski', prefix: 'ha/rok'},
    'CZ' : {language: 'Čeština', prefix: 'ha/rok'},
    'LT' : {language: 'Lietuvių', prefix: 'ha/year'},
    'SK' : {langauge: 'Slovenčina', prefix: 'ha/year'}
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
        let source = document.getElementById("entry-template").innerHTML;
        let template = Handlebars.compile(source);
        let output = response.filter(element => {
            element['prefix'] = langaugeMapping[region].prefix;
            return element.yearly_rate !== 0;
        });
        var html = template({output});
        $('.price-plan').remove();
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
        let mappedLanguageValue = langaugeMapping[$chosenLanguage].language;
        
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
