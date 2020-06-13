"use strict";

let toDoObjects = [];

function biuldTable(){
    let $table = $("<table>");
    let $tableHeader = $("<tr>");
    let $IDHeader = $("<th>").text('ID');
    let $titleHeader = $("<th>").text('Title');
    let $valueHeader = $("<th>").text('Value');
    let $dateHeader = $("<th>").text('Date');
    let $taxHeader = $("<th>").text('Tax');
    let $commentsHeader = $("<th>").text('Comments');


    $tableHeader.append($IDHeader);
    $tableHeader.append($titleHeader);
    $tableHeader.append($valueHeader);
    $tableHeader.append($dateHeader);
    $tableHeader.append($taxHeader);
    $tableHeader.append($commentsHeader);

    $table.append($tableHeader);

    return $table;
}

function populateNewest() {
    let toDos = formatToDos();
    let $table = biuldTable();

    let $tbody = $("<tbody>").attr('id', 'body');

    for (let i = toDos.length - 1; i >= 0; i--) {
        let $linha = $("<tr>");
        let $colunaID = $("<td>");
        let $colunaTitle = $("<td>");
        let $colunaValue = $("<td>");
        let $colunaDate = $("<td>");
        let $colunaTax = $("<td>");
        let $colunaComments = $("<td>");
        
        let $button = $("<td>").append("<button>").addClass('remove').text('X');

        $colunaID.text(toDos[i][0]);
        $colunaTitle.text(toDos[i][1]);
        $colunaValue.text(toDos[i][2]);
        $colunaDate.text(toDos[i][3]);
        $colunaTax.text(toDos[i][4]);
        $colunaComments.text(toDos[i][5]);

        $linha.append($colunaID);
        $linha.append($colunaTitle);
        $linha.append($colunaValue);
        $linha.append($colunaDate);
        $linha.append($colunaTax);
        $linha.append($colunaComments);
        $linha.append($button);

        $tbody.append($linha);
    }
    $table.append($tbody);

    $(function () {
        $("td").dblclick(function () {

            let tds = $(this).parent().children() 
            let conteudoOriginal = $(this).text();
             
            $(this).addClass("celulaEmEdicao");
            $(this).html("<input type='text' value='" + conteudoOriginal + "' />");
            $(this).children().first().focus();
            $(this).children().first().keypress(function (e) {
                if (e.which == 13) {
                    var novoConteudo = $(this).val();
                    $(this).parent().text(novoConteudo);
                    $(this).parent().removeClass("celulaEmEdicao");

                    function formatTds(td){
                        td = String(td.outerHTML)
                        td = td.split(">")[1]
                        td = td.split("<")[0]
                        return td
                    }
                     // Criando o objeto que sera enviado pelo ajax

                    let updateLine = {}
                    updateLine['id'] = parseInt(formatTds(tds[0] ))
                    updateLine['title'] =  formatTds(tds[1] )
                    updateLine['value'] = parseFloat(formatTds(tds[2] ))
                    updateLine['date'] = formatTds(tds[3] )
                    updateLine['externalTax'] = parseFloat(formatTds(tds[4] ) )
                    updateLine['comments'] =  formatTds(tds[5] )
                    console.log(updateLine)

                    fetch(`http://localhost:3000/update`, {
                    method: 'POST',
                    body: JSON.stringify(updateLine),
                    headers: {
                        'content-Type': 'application/json'
                    }
                     })
                }
                
            });
             
            $(this).children().first().blur(function(){
                $(this).parent().text(conteudoOriginal);
                $(this).parent().removeClass("celulaEmEdicao");
            });
        });


    });

    return $table;
}

function populateAdd() {
    let $title = $("<input>").attr("id", "tag-title").addClass("title"),
        $titleLabel = $("<label>").attr("for", "tag-title").text("Title: "),
        $value = $("<input>").attr("id", "tag-value").addClass("value"),
        $valueLabel = $("<label>").attr("for", "tag-value").text("Value: "),
        $date = $("<input>").attr("id", "tag-date").attr("type","date").addClass("date"),
        $dateLabel = $("<label>").attr("for", "tag-date").text("Date: "),
        $comments = $("<input>").attr("id", "tag-comments").addClass("comments"),
        $commentsLabel = $("<label>").attr("for", "tag-comments").text("Comments: "),
        $button = $("<button>").text("+");

        $button.on("click", function () {
            let payment = {
                "title": $title.val(),
                "value": $value.val(),
                "date": $date.val(),
                "comments":$comments.val()
            };
            
           
            save(payment)
            $title.val("");
            $value.val("");
            $date.val("")
            $comments.val("")
        });

        return $("<div>").append($titleLabel)
                        .append($title)
                        .append($valueLabel)
                        .append($value)
                        .append($dateLabel)
                        .append($date)
                        .append($commentsLabel)
                        .append($comments)
                        .append($button);

}

function getToDoObjects() {
    return toDoObjects;
}

/**
 * Load payment from the server via Ajax
 */
function loadAll() {
    $.getJSON('http://localhost:3000/list', (data) => {
        toDoObjects = data;
        $(".tabs a span.active").trigger("click");
    });
}

/**
 * Save a payment in the server
 * After receiving a successful response, 
 * reload the data from the server
 */
function save(payment) {
    $.post('http://localhost:3000/add', payment, (res) => {
        if (res.status == 'ok') {
            $.toast('ToDo saved successfully');
            loadAll();
        } else {
            console.log(res)
            $.toast('Failed to save ToDo at the server');
        }
    });
}
// Funcao que manda o id para ser removido no servidor e depois recarrega os valores do arquivo
function removeServer(id) {
    id = parseInt(id)
    console.log(id)
    fetch(`http://localhost:3000/del`, {
        method: 'POST',
        body: JSON.stringify({id}),
        headers: {
            'content-Type': 'application/json'
        }
    })
}

function formatToDos() {
    return getToDoObjects().map(function (todo) {
        todo.date = todo.date.split("T")[0]
        return [todo.id, todo.title, todo.value, todo.date, todo.externalTax, todo.comments];
    });
}

$(function () {

    $(".tabs a span").on("click", function () {

        $(".tabs a span").removeClass("active");
        $(this).addClass("active");
        $("main .content").empty();

        let $content;

        if ($(this).is("#newest")) {
            $content = populateNewest();
        } else if ($(this).is("#oldest")) {
            $content = populateOldest();
        } else if ($(this).is("#tags")) {
            $content = populateGroupedByTags();
        } else if ($(this).is("#add")) {
            $content = populateAdd();
        }

        $("main .content").append($content);

        // Onde ocorre a remocao dos valores
        $('.remove').on('click', async(event) => {
            // Guardo o ID em uma variavel e removo da tabela o valor escolhido
            let id = $(event.target).parent().children()[0].textContent;
            $(event.target).parent().remove();

            // Chamo a funcao que envia ID para o servidor para ele ser removido la
            console.log(id)
            await removeServer(id);
        });

        return false;
    });

  
    loadAll();


    $("#newest").trigger("click");

});
