import React from "react";
import ReactDataGrid from "react-data-grid";
    
    function Table({columnHeaders, rows }) {
        const columns = [];
        
        columnHeaders.forEach(function(item){
            let str = item.replace(/\s/g, '')
            let a = {                    
                key: str,
                name: str,
                width: 180,
            }
            columns.push(a);
        })   
        
        return (
        <ReactDataGrid 
            columns={columns}
            rowGetter={i => rows[i]}
            rowsCount={rows.length}
            minHeight={300}
            />
        );
    }

export default Table;