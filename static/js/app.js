// ----- buildMetadata Function ----- //
// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  var url = `/metadata/${sample}`;
  console.log("buildMetadata() initiated...");

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function (response) {
      var meta_data = d3.select("#sample-metadata");
      meta_data.html("");
      console.log(response);
      Object.entries(response).forEach(([key, value]) => {
        console.log(key, value);
        var cell = meta_data.append("li");
            cell.html(`<b>${key}</b>: ${value} \n`);
      });
  });
}

// ----- buildCharts Function ----- //
function buildCharts(sample) {
  var url = `/samples/${sample}`;
  console.log("buildCharts() initiated...");
  
  // ----- Bubble Chart ----- //
  // Build a Bubble Chart using the sample data
  d3.json(url).then(function (response) {
      var sample_x = response.otu_ids;
      var sample_y = response.sample_values;
      var sample_text = response.otu_labels;
      var trace1 = {
          x: sample_x,
          y: sample_y,
          mode: "markers",
          marker: {
              size: sample_y,
              color:  sample_x
          },
          text: sample_text,
      };

      var data1 = [trace1];
      
      var layout1 = {
          title: "Samples",
          showlegend: false,
          autosize: true
      };
      
      Plotly.newPlot("bubble", data1, layout1, {
          scrollZoom: true
      });
  });

  // ----- Pie Chart ----- //
  // Build a Pie Chart for the top 10 sample types
  d3.json(url).then(function (response) {
      var sample_labels = response.otu_ids.slice(0, 10);
      var sample_values = response.sample_values.slice(0, 10);
      var sample_hover = response.otu_labels.slice(0, 10);

      var trace2 = {
          labels: sample_labels,
          values: sample_values,
          hovertext: sample_hover,
          hoverinfo: "hovertext",
          textposition: "outside",
          type: "pie"
      };
      
      var data2 = [trace2];
      
      var layout2 = {
          title: "Top 10 Sample Types",
          autosize: true
      };
      
      Plotly.newPlot("pie", data2, layout2);
  });
}

// ----- initial function ----- //
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();