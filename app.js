// Save the URL to a variable

// set URL variables to the api routes with JSONified data
const URL = "http://127.0.0.1:5000/api/full-data"
const URL_demo = "http://127.0.0.1:5000/api/demo-data"
const URL_pie = "http://127.0.0.1:5000/api/pie-data"

// initialize the regional information callout
function demographics(sample){
    d3.json(URL_demo).then(function(rawData){
    // set variable accessing the data
    let meta = rawData;

    // filter the result to the specific CBSA from the dropdown, and select the data
    let filtered = meta.filter(result => result.cbsa_name == sample);
    let result = filtered[0]

    // access the panel from index.html
    d3.select("#sample-metadata").html("");
    

    // append each key value pair for a sample to the panel
    Object.entries(result).forEach(function([key,value]){
        let sampleMeta = d3.select("#sample-metadata")
        console.log(`key-value :: ${key}:${value}`);
        if (key != 'cbsa_name'){
            sampleMeta.append("p").text(`${key}: ${value.toLocaleString("en-US")}`);
        }
        else {sampleMeta.append("p").text(`  `);
        };
    });
})};

// Initialize all plots and the regional info panel
function initAll(){
    d3.json(URL).then(function(rawData){
    // select the dropdown menu from the HTML and add an option for each value in "names" 
    let selector = d3.select("#selDataset");
    let names = [];

    // set names to be each CBSA name in the dataset
    for (let i = 0; i<rawData.length;i++){
        names.push(rawData[i].cbsa_name)
    };
    console.log(names);
    names.forEach(function(sample){
        selector
        .append("option")
        .text(sample)
        .property("value",sample)
    });

    // set the initializing sample to be the first CBSA in "names"
    sampleZero = names[0];
    console.log(sampleZero);
    // call each function to produce the initial plots
    initBar(sampleZero);
    initBubble(sampleZero);
    demographics(sampleZero);
    initPie(sampleZero);
})};

// Initialize the pie chart to show the employment breakdown
function initPie(sample){
    d3.json(URL_pie).then(function(rawData){

    // set variables accessing the data and then filter to the selected CBSA
    let sampleData = rawData;
    let result = sampleData.filter(result => result.cbsa_name == sample);

    // set the colors to be used in the pie chart
    let colorList = ['rgb(42,77,105)', 'rgb(173,203,227)', 'rgb(99,172,229)']
    
    // using the api route, identify the variables that equal the sum of all jobs in a sector
    for (let i = 0; i<result.length; i++) {
        retail = result[i].sum_1,
        office = result[i].sum_2,
        industrial = result[i].sum_3
    };

    // set the trace, identify the variables, labels and colors
    let tracePie = {
        values: [retail, office, industrial],
        labels: ['Retail', 'Office', 'Industrial'],
        type: "pie",
        marker: {
            colors: colorList
        }
    };

    // set the layout and have each sample's name populate the title
    let layout = {
        title:`Employment Breakdown for <br> ${sample}`,
            font: {size: 12},
        height: 400,
        width: 500,
        paper_bgcolor:'rgba(0,0,0,0)',
        plot_bgcolor:'rgba(0,0,0,0)'
    };

    let data = [tracePie];

Plotly.newPlot("bar", data, layout);
})};

function initBar(){
    // repeat a similar process as above, except no need to specify the CBSA
    d3.json(URL).then(function(rawData){
        let sampleData = rawData;
    
        let cbsa = [];
        let pop = [];
        let sampleValues = [];
        for (let i = 0; i<sampleData.length; i++) {
            cbsa.push(sampleData[i].cbsa_name),
            pop.push(sampleData[i].cbsa_pop),
            sampleValues.push(sampleData[i].AvgWalkInd)
        };
        // create the chart using Charts.js
        const ctx = document.getElementById('pie');
        
            new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cbsa,
                datasets: [{
                    label: 'Walkability Index',
                    data: sampleValues
            }]},
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Core-Based Statistical Area"
                        },
                        ticks: {
                            display: false
                        }
                    },
                    y: {
                        title: {
                          display: true,
                          text: 'Walkability Index'
                    }
                }
            }
            }
        })
    })
};

function initBubble(){
    // repeat the same process for the bubble chart, using plotly instead of charts.js
    d3.json(URL).then(function(rawData){
    
    let sampleData = rawData;
    
    let cbsa = [];
    let pop = [];
    let sampleValues = [];
    let housingUnits = [];
    let markerSize = [];
    for (let i = 0; i<sampleData.length; i++) {
        cbsa.push(sampleData[i].cbsa_name),
        pop.push(sampleData[i].cbsa_pop),
        sampleValues.push(sampleData[i].d1a_avg),
        housingUnits.push(sampleData[i].counthu_sum),
        // since the number of housing units was very large, divide so that the size is proportional but not the exact number
        markerSize.push(sampleData[i].counthu_sum/100000)
    };

    // print values
    console.log(markerSize);

    let traceBubble = {
        x: pop,
        y: sampleValues,
        mode: 'markers',
        text: cbsa,
        marker: {
            color: housingUnits,
            size: markerSize
        },
    };

    let data = [traceBubble];
    let layout = {
        xaxis: {
            title: {
                text: 'CBSA Population'}},
        yaxis: {
            title:{
                text:'Residential Density (Units/Acre)'
            }
        },
        paper_bgcolor:'rgba(0,0,0,0)',
        plot_bgcolor:'rgba(0,0,0,0)'
    };

Plotly.newPlot("bubble", data, layout)
})};

// create the function to update charts each time a new sample is selected
function optionChanged(value){
    initBubble(value),
    demographics(value),
    initPie(value)
};

initAll();
