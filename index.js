// JSON promises
var parcelPromise = $.ajax({
    url: 'https://data.sfgov.org/resource/acdm-wktn.json?active=true', // Filter for active parcels
    dataType: 'json',
    data: {
        '$limit': 240000, // Max 240000
        '$$app_token': 'hpyU6vHFGv0n4whX3zBmjKBSF'
    }
});
var buildingPromise = $.ajax({
    url: 'https://data.sfgov.org/resource/a2rp-pwkh.json',
    dataType: 'json',
    data: {
        '$limit': 160000, // Max 160000
        '$$app_token': 'hpyU6vHFGv0n4whX3zBmjKBSF'
    }
});

// Possible zoning codes
let zoningCodes = new Set();
function addZoningCodes(codeArray) {
    codeArray.forEach(elem => zoningCodes.add(elem));
}
function getZoningCodes(zoningCodes) {
    let obj = {};
    zoningCodes = Array.from(zoningCodes).sort();
    zoningCodes.forEach(elem => obj[elem] = elem);
    return obj;
}

// Prep data
function prepData(parcelData, buildingData) {
    // Create dictionary to easily access building data
    let buildingDict = {};
    for(let i = 0; i < buildingData.length; i++) {
        let obj = buildingData[i];
        buildingDict[obj.blklot] = {
            'bldgsqft': obj.bldgsqft,
            'yrbuilt': obj.yrbuilt,
            'landuse': obj.landuse
        };
    }

    // Create new dataset
    let newData = [];
    for(let i = 0; i < parcelData.length; i++) {
        let obj = parcelData[i];
        let newObj = {
            'full_address': `${obj.to_address_num} ${obj.street_name} ${obj.street_type}`,
            'blklot': obj.blklot,
            'zoning_code': obj.zoning_code
        };
        if(obj.zoning_code) {
            addZoningCodes(obj.zoning_code.split('|'));
        }
        if(obj.blklot in buildingDict) {
            newObj['bldgsqft'] = parseInt(buildingDict[obj.blklot].bldgsqft);
            newObj['yrbuilt'] = parseInt(buildingDict[obj.blklot].yrbuilt);
            newObj['landuse'] = buildingDict[obj.blklot].landuse;
        }
        newData.push(newObj);
    }
    return newData;
}

// Create table
function createTable(data) {
    var table = new Tabulator("#my-table", {
        data: data,
        layout: 'fitColumns',
        responsiveLayout: 'hide',
        pagination: 'local',
        paginationSize: 19,
        tooltips: true,
        columns:[{
                title: 'Parcel Address',
                field: 'full_address',
                sorter: 'string',
                headerFilter: 'input'
            }, {
                title: 'Parcel Number',
                field: 'blklot',
                sorter: 'string',
                headerFilter: 'input'
            }, {
                title: 'Zoning',
                field: 'zoning_code',
                sorter: 'string',
                headerFilter: 'select',
                headerFilterParams: { values: getZoningCodes(zoningCodes) }
            }, {
                title: 'Building Area',
                field: 'bldgsqft',
                sorter: 'number',
                headerFilter: minMaxFilterEditor,
                headerFilterFunc: minMaxFilterFunction,
                headerFilterLiveFilter: false
            }, {
                title: 'Year Built',
                field: 'yrbuilt',
                sorter: 'number',
                headerFilter: minMaxFilterEditor,
                headerFilterFunc: minMaxFilterFunction,
                headerFilterLiveFilter: false
            }, {
                title: 'Land Use',
                field: 'landuse',
                sorter: 'string',
                headerFilter: 'select',
                headerFilterParams: { values: true }
            }
        ],
    });
}

// Fetch data
$.when(parcelPromise, buildingPromise).then(function(parcelData, buildingData) {
    $('#loading').remove();
    parcelData = parcelData[0];
    buildingData = buildingData[0];

    let data = prepData(parcelData, buildingData);
    createTable(data);
});