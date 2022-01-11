import 'bootstrap/dist/css/bootstrap.min.css';

import { Button, Container, Modal, Navbar, Table } from "react-bootstrap"
import React, { useEffect } from "react";

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      api_result : [],
      search : "",
      total_results : 1,
      total_pages : 1,
      per_page : 1,
      page : 1,
      showModal : false,
      modalResult : []
    }
  }

  componentDidMount(){
    console.log(this.state.api_result.length)
  }

  searchSIRET = () => {
    fetch("https://entreprise.data.gouv.fr/api/sirene/v1/siret/"+this.state.search)
    .then(response => {
      if (response.status === 200)
      {
        return response.json()
      }
    })
    .then(json => {
      this.setState({
        api_result : [json.etablissement],
        total_results : json.total_results,
        total_pages : json.total_pages,
        per_page : json.per_page,
        page : json.page
      })
      console.log(this.state)
    })
  }

  searchNAME = () => {
     fetch("https://entreprise.data.gouv.fr/api/sirene/v1/full_text/"+this.state.search)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      }
    })
    .then(json => {
      this.setState({
        api_result : json.etablissement,
        total_results : 1,
        total_pages : 1,
        per_page : 1,
        page : 1,
      })
      console.log(this.state)
    })
  }

  onSearchBarChange = (e) => {
    this.setState({search : e.target.value})
  }

  handleClose = () => {
    this.setState({showModal : false})
  }

  render(){
      return <div>
      <Navbar className='justify-content-between border-bottom'>
        <Container>
          <Navbar.Brand>Test Technique Kipsoft</Navbar.Brand>
          <div className='d-flex'>
            <input type={"text"} onChange={this.onSearchBarChange}/>
            <button onClick={this.searchSIRET}>SIRET</button>
            <button onClick={this.searchNAME}>NAME</button>
          </div>
        </Container>
      </Navbar>
      <Container>
        {!this.state.api_result.length ? <div><h3>Veuillez rentrer des données</h3></div> : <Table>
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
                <td><Button variant='primary' onClick={() => this.setState({showModal : true, modalResult : result})}>Plus d'info</Button></td>
                {this.state.showModal ? <VerticallyCenteredModal handleClose={this.handleClose} data={this.state.modalResult} show={this.state.showModal} /> : <></>}
              </tr>
            ))}
          </tbody>
        </Table>}
      </Container>

    </div>
  }

}

function VerticallyCenteredModal(props){
  useEffect(() => {
    console.log(props.data)
  }, []);
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