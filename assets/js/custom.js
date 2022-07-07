jQuery(document).ready(function() {
    moment.locale('pt-BR');

    $('.dt').mask('00/00/0000');

    $('.dt').datepicker({
        language: "pt-BR",
        autoclose: true,
        orientation: 'bottom',
        todayHighlight: true,

    }).on('hide', function(e) {
        e.preventDefault();
        if ($(this).val() !== '') {
            if (!validarData($(this).val())) {
                showMessage('Atenção', 'Data inválida', 'danger');
                $(this).val('');
                $(this).datepicker('setDate', null);
            } else {
                $(this).datepicker('setDate', moment($(this).val(), "DD/MM/YYYY").format("DD/MM/YYYY"));
            }
        }
    });

    $('.moeda').maskMoney({
        prefix: '',
        suffix: '',
        affixesStay: false,
        thousands: '.',
        decimal: ',',
        precision: 2,
        allowZero: false,
        allowNegative: false,
        formatOnBlur: false,
        selectAllOnFocus: false,
        allowEmpty: true
    });    

    table_fatura_nf = $('#table-fatura-nf').DataTable({
        'order': [1, 'asc'],
        'language': {
            "sEmptyTable": "Nenhum registro para exibir",
            "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
            "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
            "sInfoFiltered": "(Filtrados de _MAX_ registros)",
            "sInfoPostFix": "",
            "sInfoThousands": ".",
            "sLengthMenu": "_MENU_ Registros por página",
            "sLoadingRecords": "Carregando...",
            "sProcessing": "Processando...",
            "sZeroRecords": "Nenhum registro encontrado",
            "sSearch": "Pesquisar",
            "select": {
                "rows": {
                        "_": "%d registros selecionados",
                        "0": "",
                        "1": "1 registro selecionado"
                }
            },
            "oPaginate": {
                "sNext": "Próximo",
                "sPrevious": "Anterior",
                "sFirst": "Primeiro",
                "sLast": "Último"
            },
            "oAria": {
                "sSortAscending": ": Ordenar colunas de forma ascendente",
                "sSortDescending": ": Ordenar colunas de forma descendente"
            }
        }
    });

    $('#btn-add-duplicata-nf').on('click', function(e){
        e.preventDefault();

        if( $('#numero-duplicata-nf').val() === '' ){
            return swal({
                title: "Atenção!",
                text: "Digite o número da Fatura/Duplicata",
                icon: "error"
            }).then(function() {
                $('#numero-duplicata-nf').focus()
            });
        }


        if( $('#vencimento-duplicata-nf').val() === '' ){
            return swal({
                title: "Atenção!",
                text: "Digite o vencimento da Fatura/Duplicata",
                icon: "error"
            }).then(function() {
                $('#vencimento-duplicata-nf').focus()
            });
        }
        
        if( $('#valor-duplicata-nf').val() === '' ){
            return swal({
                title: "Atenção!",
                text: "Digite o valor da Fatura/Duplicata",
                icon: "error"
            }).then(function() {
                $('#valor-duplicata-nf').focus()
            });
        }

        table_fatura_nf.row.add([
            "<i class='fa fa-trash row-delete' aria-hidden='true'></i>",
            $('#numero-duplicata-nf').val(),
            $('#vencimento-duplicata-nf').val(),
            $('#valor-duplicata-nf').val()
        ]).draw();

        $('#numero-duplicata-nf').val(''),
        $('#vencimento-duplicata-nf').val(''),
        $('#valor-duplicata-nf').val('')
        $('#vencimento-duplicata-nf').datepicker('setDate', null);
        $('#numero-duplicata-nf').focus();
    })


    table_fatura_nf.on('click', '.row-delete', function(){

        swal({
            title: "Atenção",
            text: "Tem certeza que deseja excluir a Fatura/Duplicata?",
            icon: "warning",
            buttons: ["Não", "Sim"],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                table_fatura_nf.row( $(this).parents('tr') ).remove().draw();
            } else {
              
            }
          });

        
    });

    let abertura_formulario = moment().format('DD/MM/Y HH:mm:ss');
    let preenchimento_cpf_cnpj_cedente = null;
    let finalizacao_formulario = null;

    $('#cnpj-cpf-cedente').on('blur', function(e){
        e.preventDefault();
        preenchimento_cpf_cnpj_cedente = moment().format('DD/MM/Y HH:mm:ss');
    });

    $('#btn-finalizar').on('click', function(e){
        e.preventDefault();

        finalizacao_formulario = moment().format('DD/MM/Y HH:mm:ss');

        var data = new Array();
        data.push(["Abertura do Formulário: ", abertura_formulario]);
        data.push(["Preenchimento Campo CPF/CNPJ Cedente: ", preenchimento_cpf_cnpj_cedente]);
        data.push(["Finalização Formulário: ", finalizacao_formulario]);
       
        var json = JSON.stringify(data);


        var blob1 = new Blob([json], { type: "text/plain;charset=utf-8" });

        var url = window.URL || window.webkitURL;
        link = url.createObjectURL(blob1);
        var a = $("<a />");
        a.attr("download", "Formulario.txt");
        a.attr("href", link);
        $("body").append(a);
        a[0].click();
        $("body").remove(a);

    });

    $('#btn-reiniciar').on('click', function(e){
        e.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        setTimeout(function() {
            location.reload();
        }, 1000);
    });

    
});

function validarData(value) {
    if (value != '') {
        value = value.replace('_', '');
        if (value.length === 10) {

            if (moment((moment(value, 'DD/MM/YYYY').format('YYYY-MM-DD')), 'YYYY-MM-DD').isValid()) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}