$(document).ready(function() {

  impress().init();

  var apiurl  = 'http://bi.app/api';
  var dropown = 1;

  // fetch the data for the dropdown
    // add the data to the DOM
    // hide the loading thing

  // on change the dropdown
    // show the loading thing
    // get the value for the dropdown and store in a global(ish) var
    // call initialize

  var calls = [
    {
      name: 'page2',
      url: '/charts/page2/'
    }, {
      name: 'page3',
      url: '/charts/page3/'
    }
  ];


  function initialize() {

    var promises = $(calls).map(function(i, arr) {

      return $.ajax({
        url: apiurl + arr.url + dropown,
        type: 'GET'
      }).done(function(data) {
        calls[i].data = data;
      });

    }).get();

    $.when.apply($, promises).done(function() {
      // hide the loading thing
      // go to the next page
      // instanciate the first graph
    });
  }

  function makeAjaxCall(url, charttype, id) {
    $.ajax({
      url: apiurl + url,
      type: "GET"
    })
    .done(function(data) {

      // call a function
      createLineChart(data, '#chart');
      
    });
  }

  function createLineChart(data, element) {
    var arr  = ['2015'];
    var arr2 = ['2014'];

    data.records.forEach(function(record) {
      arr.push(record.original_estimate_value);
      arr2.push(record.original_estimate_value * 2);
    });

    var chart = c3.generate({
      bindto: element,
      data: {
        columns: [ arr, arr2 ]
      },
      axis: {
        x: {
          type: 'category',
          categories: ['Jan', 'Feb']
        }
      }
    });
  }

});


