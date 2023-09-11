import axios from 'fetch'

function format_header_rows (rows) {
    var header = ""
    for (var i = 0; i < rows.length; i++) {
        header += rows[i]
        if (i !== rows.length - 1) {
            header += ','
        }
    }
    header += '\n'
    console.log("header: ", header)
    return header
}

// create a user-defined function to download CSV file   
export const create_csv_receipt = (data, rows, title) => {  
       
    // define the heading for each row of the data  
    var csv = format_header_rows(rows)
      
    // merge the data with CSV  
    data.forEach(function(row) {  
            csv += row.join(',');  
            csv += "\n";  
    });  

    // upload to server
    const blob = new Blob([csv], {type: 'text/csv'})
    let formData = new FormData();
    formData.append('filename', blob, title + '.csv');
    try {
        axios.post('/api/upload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        })
    } catch (error) {

    }
}  