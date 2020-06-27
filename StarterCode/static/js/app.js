// Function to create a horizontal bar chart based on the selected sample
function DrawBarChart(selSampleID)
{
    console.log("DrawBarChart: sample = ", selSampleID);

    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == selSampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
        var barData = [ {
                x: sample_values.slice(0, 10).reverse(),
                y: yticks,
                type: "bar",
                text: otu_labels.slice(0, 10).reverse(),
                orientation: "h"
        }];

        var barLayout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: {t: 30, l: 150}
        };

        Plotly.newPlot("bar", barData, barLayout);
    });
}

// Function to create a Pie Gauge Chart based on the selected sample washing frequency
function DrawPieGaugeChart(selSampleID)
{
    console.log("DrawPieGaugeChart: sample = ", selSampleID);

    d3.json("samples.json").then((data) => {

        var metadata = data.metadata;

        var resultArray = metadata.filter(sampleObj => sampleObj.id == selSampleID);
        var result = resultArray[0];
        var washFreq = result.wfreq;
        console.log(washFreq);

        // Derive a location of a gauge based on the single input value
        var level = 20 * washFreq;

        // Derive trigonometry calculations to place the meter pointer
        var degrees = 180 - level,
            radius = .4;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Define a 'path' shape to visualize a needle pointer in a gauge meter via a triagle like shape
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        // part of data to input
        var traceGauge = {
            type: 'pie',
            showlegend: false,
            hole: 0.4,
            rotation: 90,
            values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
            text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
            textinfo: 'text',
            title: { text: "Scrubs per Week" },
            textposition: 'outside',
            marker: {
            colors: ['rgba(232, 226, 202, .5)','rgba(232, 226, 202, .5)','rgba(210, 206, 145, .5)','rgba(202, 209, 95, .5)','rgba(170, 202, 42, .5)','rgba(rgba(110, 154, 22, .5)','rgba(14, 127, 9, .5)','rgba(14, 116, 0, .5)','rgba(14, 100, 0, .5)','white'],
            labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            hoverinfo: 'label'
            }
        };
        
        var gaugeLayout = {
            shapes:[{
                type: 'path',
                path: path,
                xref: "x",
                fillcolor: 'brown',
                line: { color: 'brown' }
              }],
            title: 'Belly Button Washing Frequency',
            xaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]},
            yaxis: {zeroline:false, showticklabels:false,
                showgrid: false, range: [-1, 1]}
        };

        var gaugeData = [traceGauge];

        Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    });
}

// Function to create a Bubble Chart based on the selected sample
function DrawBubbleChart(selSampleID)
{
    console.log("DrawBubbleChart: sample =", selSampleID);

    d3.json("samples.json").then((data) => {

        var samples = data.samples;
        var resultArray = samples.filter(sampleObj => sampleObj.id == selSampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
            }}
        ];

        var bubbleLayout = {
            title: "Bacteria Cultures Per Sample",
            margin: {t: 0},
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            margin: {t: 30}
        };

        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    });    
}

// Function to show selected sample metadata
function ShowMetadata(selSampleID)
{
    console.log("ShowMetadata: sample =", selSampleID);

    d3.json("samples.json").then((data) => {
        var metadata = data.metadata;

        var resultArray = metadata.filter(sampleObj => sampleObj.id == selSampleID);
        var result = resultArray[0];
        console.log(result);

        var PANEL = d3.select("#sample-metadata");
        PANEL.html("");
        Object.entries(result).forEach(([key, value]) => {
            var textToShow = `${key.toUpperCase()}: ${value}`;
            PANEL.append("h6").text(textToShow);
        });
    });
}

// Function calls to perform upon option change envent
function optionChanged(newSampleID)
{
    console.log("Dropdown changed to: ", newSampleID);

    ShowMetadata(newSampleID);
    DrawBarChart(newSampleID);
    DrawPieGaugeChart(newSampleID);
    DrawBubbleChart(newSampleID);
}

// Initialization function definitiokn
function Init()
{
    console.log("Initializing Screen");
    // Populate dropdown
    var selector = d3.select("#selDataset");
    
    d3.json("samples.json").then((data) => {
        var sampleNames = data.names;

        sampleNames.forEach((sampleID) => {
            selector
                .append("option")
                .text(sampleID)
                .property("value", sampleID);
        });

        var sampleID = sampleNames[0];

        DrawBarChart(sampleID);
        DrawPieGaugeChart(sampleID);
        DrawBubbleChart(sampleID);
        ShowMetadata(sampleID);
    });
}

Init();
