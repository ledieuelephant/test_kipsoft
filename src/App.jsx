import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Container, Modal, Navbar, Table } from "react-bootstrap"
import React, { useEffect } from "react";

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      api_result: [],
      search: "",
      total_results: 1,
      total_pages: 1,
      per_page: 1,
      page: 1,
      showModal: false,
      modalResult: [],
      type: ""
    }
  }

  searchSIRET = () => {
    fetch("https://entreprise.data.gouv.fr/api/sirene/v1/siret/" + this.state.search)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(json => {
        this.setState({
          api_result: [json.etablissement],
          total_results: json.total_results,
          total_pages: json.total_pages,
          per_page: json.per_page,
          page: parseInt(json.page),
          type: "siret"
        })
      })
  }

  searchNAME = () => {
    fetch("https://entreprise.data.gouv.fr/api/sirene/v1/full_text/" + this.state.search)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(json => {
        this.setState({
          api_result: json.etablissement,
          total_results: json.total_results,
          total_pages: json.total_pages,
          per_page: json.per_page,
          page: parseInt(json.page),
          type: "name"
        })
      })
  }

  onSearchBarChange = (e) => {
    this.setState({ search: e.target.value })
  }

  modalClose = () => {
    this.setState({ showModal: false })
  }


  // Fonction relié a l'input number et fetch la page en fonction de sa value
  fetchByNumber = (e) => {
    fetch("https://entreprise.data.gouv.fr/api/sirene/v1/siret/" + this.state.search + "?page=" + e.target.value)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(json => {
        this.setState({
          api_result: [json.etablissement],
          total_results: json.total_results,
          total_pages: json.total_pages,
          per_page: json.per_page,
          page: json.page,
          type: "siret"
        })
      })
    fetch("https://entreprise.data.gouv.fr/api/sirene/v1/full_text/" + this.state.search + "?page=" + e.target.value)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(json => {
        this.setState({
          api_result: json.etablissement,
          total_results: json.total_results,
          total_pages: json.total_pages,
          per_page: json.per_page,
          page: json.page,
          type: "name"
        })
      })
  }

  // Fonction relié au système de pagination
  pageChange = (page) => {
    fetch("https://entreprise.data.gouv.fr/api/sirene/v1/siret/" + this.state.search + "?page=" + page)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(json => {
        this.setState({
          api_result: [json.etablissement],
          total_results: json.total_results,
          total_pages: json.total_pages,
          per_page: json.per_page,
          page: json.page,
          type: "siret"
        })
      })
    fetch("https://entreprise.data.gouv.fr/api/sirene/v1/full_text/" + this.state.search + "?page=" + page)
      .then(response => {
        if (response.status === 200) {
          return response.json()
        }
      })
      .then(json => {
        this.setState({
          api_result: json.etablissement,
          total_results: json.total_results,
          total_pages: json.total_pages,
          per_page: json.per_page,
          page: json.page,
          type: "name"
        })
      })
  }

  render() {
    return <div>
      <Navbar className='justify-content-between border-bottom'>
        <Container>
          <Navbar.Brand>Test Technique Kipsoft</Navbar.Brand>
          <div className='d-flex'>
            <input type={"text"} class="form-control m-1" onChange={this.onSearchBarChange} />
            <button type='button' className='btn btn-success m-1 ' onClick={this.searchSIRET}>SIRET</button>
            <button type='button' className='btn btn-success m-1 ' onClick={this.searchNAME}>NAME</button>
          </div>
        </Container>
      </Navbar>
      <Container>
        {!this.state.api_result.length ? <div style={{ height: "80vh" }} className='d-flex justify-content-center align-items-center'><h3>Pour avoir accès aux résultats, veuillez rechercher le nom d'une entreprise ou son SIRET</h3></div> : <div>
          <Table className='m-4'>
            <thead>
              <tr>
                <th>Raison Sociale</th>
                <th>Siren</th>
                <th>Siret</th>
                <th>Plus d'info</th>
              </tr>
            </thead>
            <tbody>
              {this.state.api_result.map(result => (
                <tr key={result.id}>
                  <td>{result.nom_raison_sociale}</td>
                  <td>{result.siren}</td>
                  <td>{result.siret}</td>
                  <td><Button variant='primary' onClick={() => this.setState({ showModal: true, modalResult: result })}>Plus d'info</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          {this.state.type === "name" ? <div className='input-group-sm d-flex flex-column'>
            <div className='d-flex justify-content-center'>
              <nav aria-label="Page navigation example" >
                <ul class="pagination justify-content-center">
                  {parseInt(this.state.page) === 1 ? <li class="page-item disabled">
                    <a class="page-link" href="#" tabindex="-1" onClick={() => this.pageChange(parseInt(this.state.page) - 1)}>Previous</a>
                  </li> : <li class="page-item">
                    <a class="page-link" href="#" tabindex="-1" onClick={() => this.pageChange(parseInt(this.state.page) - 1)}>Previous</a>
                  </li>}
                  {parseInt(this.state.page) === 1 ? <></> : <li class="page-item"><a class="page-link" href="#" onClick={() => this.pageChange(parseInt(this.state.page) - 1)}>{parseInt(this.state.page) - 1}</a></li>}
                  <li class="page-item active"><a class="page-link active" href="#">{parseInt(this.state.page)}</a></li>
                  {parseInt(this.state.page) === parseInt(this.state.total_pages) ? <></> : <li class="page-item"><a class="page-link" href="#" onClick={() => this.pageChange(parseInt(this.state.page) + 1)}>{parseInt(this.state.page) + 1}</a></li>}
                  {parseInt(this.state.page) === parseInt(this.state.total_pages) ? <li class="page-item disabled">
                    <a class="page-link" href="#" onClick={() => this.pageChange(parseInt(this.state.page) + 1)}>Next</a>
                  </li> : <li class="page-item">
                    <a class="page-link" href="#" onClick={() => this.pageChange(parseInt(this.state.page) + 1)}>Next</a>
                  </li>}
                </ul>
              </nav>
            </div>
            <h4>Page <input className='m-2' value={this.state.page} type="number" max={this.state.total_pages} min={0} onChange={this.fetchByNumber} />/{this.state.total_pages}</h4>
          </div> : <></>}
        </div>}
      </Container>
      {this.state.showModal ? <VerticallyCenteredModal handleClose={this.modalClose} data={this.state.modalResult} show={this.state.showModal} /> : <></>}
    </div>
  }

}

// Le Modal qui apparait lorsqu'on clique sur le bouton "Plus d'info"
function VerticallyCenteredModal(props) {
  return <Modal
    show={props.show}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    onHide={props.handleClose}
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        Plus d'info sur {props.data.nom_raison_sociale}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>Nom : {props.data.nom_raison_sociale}</p>
      <p>SIREN : {props.data.siren}</p>
      <p>SIRET : {props.data.siret}</p>
      <p>Date de création : {props.data.date_creation}</p>
      <p>Date de début d'activité : {props.data.date_debut_activite}</p>
      <p>Adresse : {props.data.geo_adresse}</p>
      <p>Activite principale : {props.data.libelle_activite_principale}</p>
      <p>Nature juridique : {props.data.libelle_nature_juridique_entreprise}</p>
    </Modal.Body>
  </Modal>
}