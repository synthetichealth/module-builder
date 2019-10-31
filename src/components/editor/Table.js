import React, {useState} from "react";
import ReactDataGrid from "react-data-grid";

    const onGridRowsUpdated = ({ fromRow, toRow, updated }) => rows => {                   
                    const rows2 = rows.slice();
                    for (let i = fromRow; i <= toRow; i++) {
                      rows2[i] = { ...rows2[i], ...updated };
                    }

                    return  [...rows2] ;
                  };

    const sortRows = (sortColumn, sortDirection) => rows => {
        const comparer = (a, b) => {
            if (sortDirection === "ASC") {
            return a[sortColumn] > b[sortColumn] ? 1 : -1;
            } else if (sortDirection === "DESC") {
            return a[sortColumn] < b[sortColumn] ? 1 : -1;
            } else // sortDirection === "NONE"
            {
                return a['originalIndex'] > b['originalIndex'] ? 1 : -1;                
            }
        };
        return [...rows].sort(comparer);
    };
    
    function Table({columnHeaders, initialRows }) {
        const [rows, setRows] = useState(initialRows);
        const columns = [];
        
        columnHeaders.forEach(function(item){
            let str = item.replace(/\s/g, '')
            if (str==='originalIndex'){
                return;
            }
            let a = {                    
                key: str,
                name: str,
                //editable: true,
                sortable: true,
                width: 180,
                //resizable: true
            }
            columns.push(a);
        })   
        
        return (
        <ReactDataGrid 
            columns={columns}
            rowGetter={i => rows[i]}
            rowsCount={rows.length}
            minHeight={300}
            //onGridRowsUpdated={(fromRow, toRow, updated) => setRows(onGridRowsUpdated(fromRow, toRow, updated))}
            //enableCellSelect={true}
            // onColumnResize={(idx, width) =>
            //     console.log(`Column ${idx} has been resized to ${width}`)
            //   }
            onGridSort={(sortColumn, sortDirection) =>
                setRows(sortRows(sortColumn, sortDirection))
            }
            />
        );
    }

export default Table;