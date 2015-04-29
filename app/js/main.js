$(document).ready(function() {

  // Init impress
  impress().init();

  // Our global(ish) values
  var apiurl   = 'http://bi.app/api';
  var dropdown;

  // The dropdown data
  $.ajax({
    url: apiurl + '/charts/select-dropdown',
    type: 'GET'
  }).done(function(data) {

    var html = '<option value="0">Select Report By Month &#x25BC;</option>';

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
    },{
      name: 'page3',
      url: '/charts/page3/'
    },{
      name: 'page7',
      url: '/charts/page7/'
    },{
      name: 'page8',
      url: '/charts/page8/'
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
        bindPage2();
        break;

      case 'page-3':
        bindPage3();
        break;

      case 'page-7':
        bindPage7();
        break;

      case 'page-8':
        bindPage8();
        break;
    }
  });

  // the bind to page functions (they will be called from the switch)
  function bindCoverPage() {
    $('.coverpage-reportdate span').html(calls[0].data.records.report_date);
    $('.coverpage-dateexported span').html(calls[0].data.records.exported_date);
  }

  // the bind to page functions (they will be called from the switch)
  function bindPage2() {
    pagedata = calls[1].data;

    $page = $('#page-2');

    $previousyear = $page.find('.previousyear');
    $currentyear  = $page.find('.currentyear');

    $previousyear.find('thead > tr > th').html(pagedata.previous_year);
    $currentyear.find('thead > tr > th').html(pagedata.current_year);

    $previousyear.find('.table-total').html(pagedata.previous_year_total);
    $currentyear.find('.table-total').html(pagedata.current_year_total);

    $previousyear
      .find('tbody')
      .html(createTableHtml(pagedata.previous_year_records));

    $currentyear
      .find('tbody')
      .html(createTableHtml(pagedata.current_year_records));
  }


  // The helper functions
  function createTableHtml(data) {
    var html = '';

    data.forEach(function(record) {
      html += '<tr class="tableRow2">' +
                '<td class="trName">' + record.name + '</td>' +
                '<td class="trCount">' + record.count + '</td>' +
                '<td class="trPerc">' + record.perc + '</td>' +
              '</tr>';
    });

    return html;
  }

  function bindPage3() {
    pagedata = calls[2].data;
    
    var xaxis   = [];
    var series1 = [pagedata.previous_year];
    var series2 = [pagedata.current_year];

    pagedata.series1.forEach(function(record) {
      series1.push(record.count);

      if(xaxis.indexOf(record.month) === -1) {
        xaxis.push(record.month);
      }
    });

    pagedata.series2.forEach(function(record) {
      series2.push(record.count);

      if(xaxis.indexOf(record.month) === -1) {
        xaxis.push(record.month);
      }
    });

    //generating c3...
    var chart = c3.generate({
      //to bind use ID from the DOM
      bindto: '#page-3-line-chart',
      data: {
        //variable is array of arrays like this [['2014', 3, 5], ['2015', 4, 6]]
        columns: [series1, series2]
      },
      axis: {
        x: {
          type: 'category',
          categories: xaxis
        }
      }
    });
  }

  function bindPage7() {
    pagedata = calls[3].data;

    var series = [];

    pagedata.records.forEach(function(record) {
      series.push([record.name, parseFloat(record.perc)]);
    });

    var chart = c3.generate({
      bindto: '#page-7-pie-chart',
      data: {
          columns: series,
          type : 'pie',
          // onclick: function (d, i) { console.log('onclick', d, i); },
          // onmouseover: function (d, i) { console.log('onmouseover', d, i); },
          // onmouseout: function (d, i) { console.log('onmouseout', d, i); }
      }
    });
  }

  function bindPage8() {
    pagedata = calls[4].data;

    var series = [];

    pagedata.records.forEach(function(record) {
      // series.push([record.name, (record.count)]);
      series.push([record.name, (record.count).replace(',','')]);
    });


    console.log(series);
    var chart = c3.generate({
      bindto: '#page-8-bar-chart',
      data: {
          columns: series,
          type: 'bar',
          groups: [
              ['Closed', 'Open']
          ]
      },
      grid: {
          y: {
              lines: [{value:0}]
          }
      }
    });
  }

});


