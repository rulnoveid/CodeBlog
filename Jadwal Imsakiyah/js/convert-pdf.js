(function($){
  
    $.fn.extend({
        tableHTMLExport: function(options) {

            var defaults = {
                separator: ',',
                newline: '\r\n',
                ignoreColumns: '',
                ignoreRows: '',
                type:'csv',
                htmlContent: false,
                consoleLog: false,
                trimContent: true,
                quoteFields: true,
                filename: 'tableHTMLExport.csv',
                utf8BOM: true,
                orientation: 'p' //only when exported to *pdf* "portrait" or "landscape" (or shortcuts "p" or "l")
            };
            var options = $.extend(defaults, options);


            function quote(text) {
                return '"' + text.replace('"', '""') + '"';
            }


            function parseString(data){

                if(defaults.htmlContent){
                    content_data = data.html().trim();
                }else{
                    content_data = data.text().trim();
                }
                return content_data;
            }

            function download(filename, text) {
                var element = document.createElement('a');
                element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
            }

            /**
             * Convierte la tabla enviada a json
             * @param el
             * @returns {{header: *, data: Array}}
             */
            function toJson(el){

                var jsonHeaderArray = [];
                $(el).find('thead').find('tr').not(options.ignoreRows).each(function() {
                    var tdData ="";
                    var jsonArrayTd = [];

                    $(this).find('th').not(options.ignoreColumns).each(function(index,data) {
                        if ($(this).css('display') != 'none'){
                            jsonArrayTd.push(parseString($(this)));
                        }
                    });
                    jsonHeaderArray.push(jsonArrayTd);

                });

                var jsonArray = [];
                $(el).find('tbody').find('tr').not(options.ignoreRows).each(function() {
                    var tdData ="";
                    var jsonArrayTd = [];

                    $(this).find('td').not(options.ignoreColumns).each(function(index,data) {
                        if ($(this).css('display') != 'none'){
                            jsonArrayTd.push(parseString($(this)));
                        }
                    });
                    jsonArray.push(jsonArrayTd);

                });


                return {header:jsonHeaderArray[0],data:jsonArray};
            }


            /**
             * Convierte la tabla enviada a csv o texto
             * @param table
             * @returns {string}
             */
            function toCsv(table){
                var output = "";
                
                if (options.utf8BOM === true) {                
                    output += '\ufeff';
                }

                var rows = table.find('tr').not(options.ignoreRows);

                var numCols = rows.first().find("td,th").not(options.ignoreColumns).length;

                rows.each(function() {
                    $(this).find("td,th").not(options.ignoreColumns)
                        .each(function(i, col) {
                            var column = $(col);

                            // Strip whitespaces
                            var content = options.trimContent ? $.trim(column.text()) : column.text();

                            output += options.quoteFields ? quote(content) : content;
                            if(i !== numCols-1) {
                                output += options.separator;
                            } else {
                                output += options.newline;
                            }
                        });
                });

                return output;
            }


            var el = this;
            var dataMe;
            if(options.type == 'csv' || options.type == 'txt'){


                var table = this.filter('table'); // TODO use $.each

                if(table.length <= 0){
                    throw new Error('tableHTMLExport must be called on a <table> element')
                }

                if(table.length > 1){
                    throw new Error('converting multiple table elements at once is not supported yet')
                }

                dataMe = toCsv(table);

                if(defaults.consoleLog){
                    console.log(dataMe);
                }

                download(options.filename,dataMe);


                //var base64data = "base64," + $.base64.encode(tdData);
                //window.open('data:application/'+defaults.type+';filename=exportData;' + base64data);
            }else if(options.type == 'json'){

                var jsonExportArray = toJson(el);

                if(defaults.consoleLog){
                    console.log(JSON.stringify(jsonExportArray));
                }
                dataMe = JSON.stringify(jsonExportArray);

                download(options.filename,dataMe)
                /*
                var base64data = "base64," + $.base64.encode(JSON.stringify(jsonExportArray));
                window.open('data:application/json;filename=exportData;' + base64data);*/
            }else if(options.type == 'pdf'){

                var jsonExportArray = toJson(el);

                var contentJsPdf = {
                    head: [jsonExportArray.header],
                    body: jsonExportArray.data
                };

                if(defaults.consoleLog){
                    console.log(contentJsPdf);
                }

                var doc = new jsPDF(defaults.orientation, 'pt');
                doc.autoTable(contentJsPdf);
                doc.save(options.filename);

            }
            return this;
        }
    });
})(jQuery);