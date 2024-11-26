// Build the metadata panel
function buildMetadata(targetSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    let allMetaData = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let MyMetaData = allMetaData.filter(x => (x.id == targetSample))[0];
    console.log('MyMetaData', MyMetaData);

    // Use d3 to select the panel with id of `#sample-metadata`
    let printingPanel = d3.select('#sample-metadata');

    // Clear any existing metadata
    printingPanel.html("");

//     // Inside a loop, you will need to use d3 to append new
//     // tags for each key-value in the filtered metadata.
    Object.entries(MyMetaData).forEach(([key, value]) => {
      printingPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// function to build both charts
function buildCharts(targetSample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samples = data.samples;
    console.log('all the samples', samples)

    // Filter the samples for the object with the desired sample number
    let mySample = samples.filter(x=> (x.id == targetSample))[0];
    console.log('mySample', mySample);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = mySample.otu_ids;
    let otu_labels = mySample.otu_labels;
    let sample_values = mySample.sample_values;

    // Build a Bubble Chart
    let bubbleTrace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        color: otu_ids,
        size: sample_values.map(val => Math.sqrt(val) * 5),
      }
    };
    
    let bubbleData = [bubbleTrace];

    // Render the Bar Chart
    var bubbleLayout = {
      title: 'Bubble Chart Hover Text',
      showlegend: false,
      height: 600,
      width: 600
    };
    
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

// Build a Bar Chart based on the top 10 OTUs (same data as Bubble Chart)
const top10Values = sample_values.slice(0, 10).reverse();  // Top 10 values
const top10Ids = otu_ids.slice(0, 10).reverse();  // Top 10 OTU ids
const top10Labels = otu_labels.slice(0, 10).reverse();  // Top 10 OTU labels

const yticks = top10Ids.map(id => `OTU ${id}`);  // Format OTU ids for the y-axis labels

// Render the Bar Chart
const barData = [{
  x: top10Values,
  y: yticks,
  text: top10Labels,
  type: "bar",
  orientation: "h"
}];

const barLayout = {
  title: "Top 10 Bacteria Cultures Found",
  margin: { t: 20, l: 160 },
  xaxis: { title: "Number of Bacteria" },
};

Plotly.newPlot("bar", barData, barLayout);
});
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    console.log(data);
    // Get the names field
    let listOfOptions = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let myDropdownMenu = d3.select('#selDataset')

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for(let ii=0; ii<listOfOptions.length; ii++){
      let Onename = listOfOptions[ii];
      myDropdownMenu.append("option").text(Onename);
      console.log(Onename)
    }

    // Get the first sample from the list
    let firstName = listOfOptions[0];

    // Build charts and metadata panel with the first sample
    buildMetadata(firstName);
    buildCharts(firstName);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
