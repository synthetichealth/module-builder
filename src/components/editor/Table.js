import React from "react";
import "./Table.css";
    
function Table({columnHeaders, rows}) {
    if (!columnHeaders || !rows || rows.length === 0) {
        return <div className="table-container">No data to display</div>;
    }

    return (
        <div className="table-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {columnHeaders.map((header, index) => (
                            <th key={index} className="table-header">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="table-row">
                            {columnHeaders.map((header, colIndex) => (
                                <td key={colIndex} className="table-cell">
                                    {row[header] || ''}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Table;