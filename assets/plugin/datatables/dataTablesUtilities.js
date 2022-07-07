//$.fn.dataTable.ext.errMode = 'none';
$.fn.dataTable.ext.errMode = function ( settings, helpPage, message ) { 
    showMessage('Erro', message, 'danger');
};
function dataTablesLengthSelect(order){
    if (order === 'desc'){
        var retorno = [
            [-1,100,50,30,10],
            ['Todos',100,50,30,10]
        ];
    } else {
        var retorno = [
            [15,30,50,100,-1],
            [15,30,50,100,'Todos']
        ];
    }
    return retorno;
}

function dataTablesLanguage(language){
    switch(language) {
    case 'pt-br':
        var retorno = {'url': '/plugin/datatables/language/Portuguese-Brasil.json'};
        break;
    }
    return retorno;
}

function ajaxDataTable(setDataTable){
    
    return {
        'language'      : dataTablesLanguage('pt-br'),
        'processing'    : true,
        'scrollX'       : true,
        'select'        : setDataTable.select,
        'aLengthMenu'   : dataTablesLengthSelect(setDataTable.orderMenuLength),
        'ajax'          : {
            'url'       : setDataTable.url,
            'type'      : setDataTable.method,
            'data'      : function(){ return setDataTable.searchParams[0]},
            'dataSrc'   : setDataTable.dataSrc,   
            'error'     : function (err){
                switch(err.status){
                    case 401:
                        showMessage('Atenção', err.responseJSON.error, 'danger');
                        setTimeout(function() {
                            $(location).attr('href', urlBase + 'logout');
                        }, 500);
                    break;
                    case 403:
                        showMessage('Atenção', err.responseJSON.error, 'danger');
                    break;
                    case 406:
                        showMessage('Atenção', err.responseJSON.error, 'danger');
                        setTimeout(function() {
                            $(location).attr('href', urlBase + 'logout');
                        }, 500);
                    break;
                    case 422:
                        jQuery.each(err.responseJSON.errors, function(index, value) {
                            showMessage('Atenção', value, 'danger');
                        });
                    break;
                    case 500:
                        showMessage('Atenção', err.responseJSON.error, 'danger');
                    break;
                    case 0:
                        console.log(setDataTable.url+' 0 - Aborted');
                    break;
                    default:
                    showMessage('Atenção', 'A requisição falhou, tente novamente mais tarde ou entre em contato com o administrador do sistemas<br>' + err.status + ' - ' + err.statusText, 'warning');              
                }
            }
        },
        'aoColumns'     : setDataTable.columnsAray,
        'order'         : setDataTable.orderColumnsnArray,
        'rowCallback'   : setDataTable.rowCallBackFunction,
        'footerCallback': setDataTable.footerCallBackFunction,
        'initComplete'  : setDataTable.initCompleteFunction,
        'createdRow'    : setDataTable.createdRowFunction,
        'drawCallback'  : function() {

           
            $(".porcentagemDataTable").maskMoney({
                prefix           : "",
                suffix           : "",
                affixesStay      : false,
                thousands        : ".",
                decimal          : ",",
                precision        : 3,
                allowZero        : false,
                allowNegative    : false,
                formatOnBlur     : false,
                selectAllOnFocus : false,
                allowEmpty       : true
            });

            $(".moedaDataTable").maskMoney({
                prefix           : "",
                suffix           : "",
                affixesStay      : false,
                thousands        : ".",
                decimal          : ",",
                precision        : 2,
                allowZero        : true,
                allowNegative    : false,
                formatOnBlur     : false,
                selectAllOnFocus : false,
                allowEmpty       : false
            });

            $(".inteiroDataTable").maskMoney({
                prefix           : "",
                suffix           : "",
                affixesStay      : false,
                thousands        : ".",
                decimal          : ",",
                precision        : 0,
                allowZero        : false,
                allowNegative    : false,
                formatOnBlur     : false,
                selectAllOnFocus : false,
                allowEmpty       : true
            });

            if(setDataTable.buttons) {
                $(setDataTable.tableId+'_filter').html('');
                var buttons = new $.fn.dataTable.Buttons($(setDataTable.tableId), {
                    buttons: [
                        {
                            text:      '<i class="fas fa-search fa-fw "></i>',
                            className: 'btn btn-secondary mr-1 rounded tooltips lista '+ setDataTable.reportId+'SEARCH',
                            attr:  {
                                'onClick':             setDataTable.reportId+'SEARCH();',
                                'data-container':      'body',
                                'data-toggle':         'tooltip',
                                'data-placement':      'bottom',
                                'data-original-title': 'Pesquisar '
                            }
                        },
                        {
                            extend:    'excelHtml5',
                            text:      '<i class="far fa-file-excel fa-fw "></i>',
                            className: 'btn btn-secondary mr-1 rounded tooltips lista '+ setDataTable.reportId+'EXCEL',
                            attr:  {
                                'data-container':      'body',
                                'data-toggle':         'tooltip',
                                'data-placement':      'bottom',
                                'data-original-title': 'Gerar Excel '
                            },
                            footer :    true,
                            title:      setDataTable.reportTitle,
                            exportOptions: {
                                columns:  setDataTable.showColumnsReportArray,
                                format: {
                                    body: function(data, row, column, node) {
                                        data = $('<p>' + data + '</p>').text();
                                        return $.isNumeric(data.replace(',', '.')) ? data.replace(',', '.') : data;
                                    },
                                    footer: function(data, row, column, node) {
                                        data = $('<p>' + data + '</p>').text();
                                        return $.isNumeric(data.replace(',', '.')) ? data.replace(',', '.') : data;
                                    }
                                }
                            }
                        },
                        {
                            extend:      'pdfHtml5',
                            text:        '<i class="far fa-file-pdf fa-fw "></i>',
                            className:   ' btn btn-secondary mr-1 rounded tooltips lista '+ setDataTable.reportId+'PDF',
                            attr:  {
                                'data-container':      'body',
                                'data-toggle':         'tooltip',
                                'data-placement':      'bottom',
                                'data-original-title': 'Gerar PDF '
                            },
                            orientation: setDataTable.reportOrientation,
                            pageSize:    'A4',
                            footer :     true,
                            title:       setDataTable.reportTitle,
                            exportOptions: {
                                columns:  setDataTable.showColumnsReportArray
                            },
                            customize: function (doc) {
                                doc.styles.tableHeader.alignment = 'left';
                                doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
                            }
                        },
                        {
                            extend: 'print',
                            text:      '<i class="fas fa-print fa-fw "></i>',
                            className: ' btn btn-secondary mr-1 rounded tooltips lista '+ setDataTable.reportId+'PRINT',
                            attr:  {
                                'data-container':      'body',
                                'data-toggle':         'tooltip',
                                'data-placement':      'bottom',
                                'data-original-title': 'Imprimir '
                            },
                            orientation: setDataTable.reportOrientation,
                            pageSize: 'A4',
                            footer : true,
                            title: setDataTable.reportTitle,
                            exportOptions: {
                                columns:  setDataTable.showColumnsReportArray
                            },
                            customize: function(win)
                            {
                                var last = null;
                                var current = null;
                                var bod = [];
                                var css = '@page { size: '+setDataTable.reportOrientation+'; }',
                                    head = win.document.head || win.document.getElementsByTagName('head')[0],
                                    style = win.document.createElement('style');
                                style.type = 'text/css';
                                style.media = 'print';
                                if (style.styleSheet)
                                {
                                  style.styleSheet.cssText = css;
                                }
                                else
                                {
                                  style.appendChild(win.document.createTextNode(css));
                                }
                                head.appendChild(style);
                            }
                        }
                    ]
                }).container().appendTo($(setDataTable.tableId+'_filter'));
                $('[data-toggle="tooltip"]').tooltip();
            } else {
                $('[data-toggle="tooltip"]').tooltip();
            }
        },
        
    }
}