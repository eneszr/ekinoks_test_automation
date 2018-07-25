    ///////NOT: Oluşturulan results.xlsx dosyasını manuel olarak değiştirmeyin yoksa güncellemelerde dosya bozuluyor (dosyanın bozulması 
    ////////durumunda dosyayı silip programı yeniden çalıştırın)/////////////
    
    module.exports.excel_file = async function(test_num,result,document_no){
    const fs = require('fs');
    const child_process = require("child_process");
    var Excel = require('exceljs');
    var workbook = new Excel.Workbook();
    var excel = require('excel4node');
    var dosyayol = './results.xlsx';
    var dosyayol2 ='./results2.xlsx';
    if(document_no == 1){
        if (fs.existsSync(dosyayol)) 
        { 
            console.log("Döküman var");
            workbook.xlsx.readFile(dosyayol)
            .then(function() {
                var worksheet = workbook.getWorksheet('Sheet 1');
                var row = worksheet.getRow(test_num);
                var cell= row.getCell(1);
                var cell2= row.getCell(2);
                cell.style={numFmt: '@',alignment: { horizontal: 'left', vertical: 'bottom', wrapText: true, shrinkToFit: true, indent: 0, textRotation: 0 }}
                cell2.style={numFmt: '@',alignment: { horizontal: 'left', vertical: 'bottom', wrapText: true, shrinkToFit: true, indent: 0, textRotation: 0 }}
                row.getCell(1).value = "TEST"+test_num;
                row.getCell(2).value = result;
                row.commit();
                console.log("sonuçlar kaydedildi"); 
                return workbook.xlsx.writeFile('results.xlsx');
            })
        } 

        else {
            var workbook1 = new excel.Workbook();
            var worksheet1 = workbook1.addWorksheet('Sheet 1');
            workbook1.write('results.xlsx');
            console.log("Döküman oluşturuldu");
            setTimeout(function(){workbook.xlsx.readFile(dosyayol)
            .then(function() {
                var worksheet = workbook.getWorksheet('Sheet 1');
                var row = worksheet.getRow(test_num);
            
                var cell= row.getCell(1);
                worksheet.getColumn(2).width = 17000;
                var cell2= row.getCell(2);
                cell.style={numFmt: '@',alignment: { horizontal: 'left', vertical: 'bottom', wrapText: true, shrinkToFit: true, indent: 0, textRotation: 0 }}
                cell2.style={numFmt: '@',alignment: { horizontal: 'left', vertical: 'bottom', wrapText: true, shrinkToFit: true, indent: 0, textRotation: 0 }}
                row.getCell(1).value = "TEST"+test_num;
                row.getCell(2).value = result;
                row.commit();
                console.log("sonuçlar kaydedildi");
                return workbook.xlsx.writeFile('results.xlsx');
            
            })}, 3000);
        
        
            }
        
    }
    else if(document_no == 2){
         if (fs.existsSync(dosyayol2)) 
        { 
           console.log("Döküman var");
            workbook.xlsx.readFile(dosyayol2)
            .then(function() {
                var worksheet = workbook.getWorksheet('Sheet 1');
                var row = worksheet.getRow(test_num);
                var cell= row.getCell(1);
                var cell2= row.getCell(2);
                cell.style={numFmt: '@',alignment: { horizontal: 'left', vertical: 'bottom', wrapText: true, shrinkToFit: true, indent: 0, textRotation: 0 }}
                cell2.style={numFmt: '@',alignment: { horizontal: 'left', vertical: 'bottom', wrapText: true, shrinkToFit: true, indent: 0, textRotation: 0 }}
                row.getCell(1).value = "TEST"+test_num;
                row.getCell(2).value = result;
                row.commit();
                console.log("sonuçlar kaydedildi"); 
                return workbook.xlsx.writeFile('results2.xlsx');
            })
        } 

        else {
            
            var workbook1 = new excel.Workbook();
            var worksheet1 = workbook1.addWorksheet('Sheet 1');
            workbook1.write('results2.xlsx');
            console.log("Döküman oluşturuldu");
            setTimeout(function(){workbook.xlsx.readFile(dosyayol)
            .then(function() {
                var worksheet = workbook.getWorksheet('Sheet 1');
                var row = worksheet.getRow(test_num);
            
                var cell= row.getCell(1);
                worksheet.getColumn(2).width = 17000;
                var cell2= row.getCell(2);
                cell.style={numFmt: '@',alignment: { horizontal: 'left', vertical: 'bottom', wrapText: true, shrinkToFit: true, indent: 0, textRotation: 0 }}
                cell2.style={numFmt: '@',alignment: { horizontal: 'left', vertical: 'bottom', wrapText: true, shrinkToFit: true, indent: 0, textRotation: 0 }}
                row.getCell(1).value = "TEST"+test_num;
                row.getCell(2).value = result;
                row.commit();
                console.log("sonuçlar kaydedildi");
                return workbook.xlsx.writeFile('results2.xlsx');
            
            })}, 3000);
        
        }   
    }
}