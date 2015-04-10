$(document).ready(function() {

  // Init impress
  impress().init();

  // Our global(ish) values
  var apiurl   = 'http://bi.app/api';
  var dropdown = 1;

  // The dropdown data
  $.ajax({
    url: apiurl + '/charts/select-dropdown',
    type: 'GET'
  }).done(function(data) {

    var html = '<option value="0">Select Report By Month</option>';

    data.records.forEach(function(report) {
      html += '<option value="' + report.id + '">' + report.value + '</option>';
    });

    $('.dropdown').html(html);
    $('.loading').addClass('hide');
  });
    

  // Get started when the dropdown gets selected
  $('.step').on('change', '.dropdown', function(e) {
    $('.loading').removeClass('hide');
    dropdown = $(this).val();
    initialize();
  });


  // Our API calls
  var calls = [
    {
      name: 'coverpage',
      url: '/charts/cover-page/'
    },{
      name: 'page2',
      url: '/charts/page2/'
    }, {
      name: 'page3',
      url: '/charts/page3/'
    }
  ];


  // Get all data before getting started
  function initialize() {

    var promises = $(calls).map(function(i, arr) {

      return $.ajax({
        url: apiurl + arr.url + dropdown,
        type: 'GET'
      }).done(function(data) {
        calls[i].data = data;
      });

    }).get();

    $.when.apply($, promises).done(function() {
      $('.loading').addClass('hide');
      impress().next();
    });
  }

  // The event listener for page changes
  document.addEventListener('impress:stepenter', function(e) {

    switch(e.target.id) {
      case 'coverpage':
        bindCoverPage();
        break;

      case 'page-2':
        break;

      case 'page-3':
        break;

      case 'page-4':
        break;

      case 'page-5':
        break;
    }
  });

  // the bind to page functions (they will be called from the switch)
  function bindCoverPage() {
    $('.coverpage-reportdate span').html(calls[0].data.records.report_date);
    $('.coverpage-dateexported span').html(calls[0].data.records.exported_date);
  }

  // ...

  // The helper functions
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


