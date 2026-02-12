import React from 'react'

function MainContaint() {
  return (
    <main className="app-content">
    <div className="app-title">
      <div>
        <h1><i className="bi bi-table"></i> Data Table</h1>
        <p>Table to display analytical data effectively</p>
      </div>
      <ul className="app-breadcrumb breadcrumb side">
        <li className="breadcrumb-item"><i className="bi bi-house-door fs-6"></i></li>
        <li className="breadcrumb-item">Tables</li>
        <li className="breadcrumb-item active"><a href="#">Data Table</a></li>
      </ul>
    </div>
    <div className="row">
      <div className="col-md-12">
        <DataTable />
      </div>
    </div>
  </main>
  )
}

export default MainContaint