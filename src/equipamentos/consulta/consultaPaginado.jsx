import React, {Component} from 'react'
import { bindActionCreators } from 'redux' 
import { connect } from 'react-redux'
import { getList } from './consultaActions'
import Pagination from '../../common/pagination/pagination'

function searchingFor(termo) {
    // Verifica se a string em "term" está inclusa dentro do filtro nome
    return function(equipamento) {
        return equipamento.nome.toLowerCase().includes(termo.toLowerCase()) || 
        equipamento.descricao.toLowerCase().includes(termo.toLowerCase()) || 
        equipamento.fabricante.toLowerCase().includes(termo.toLowerCase()) ||
        equipamento.r12.toString(10).includes(termo) ||
        !termo; 
    }
}

class ConsultaPaginado extends Component {

    constructor(props) {
        super(props);
        // O estado "term" define o filtro de busca

        this.state = {
            equipamentos: [],
            termo: '',
            pageOfItems: []};

        this.handleSearch = this.handleSearch.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
/* 
        const BASE_URL = 'http://localhost:8080/equipamentos'

        fetch(`${BASE_URL}/page`)
        .then(response => response.json())
        .then(data => this.setState({equipamentos: data.content})); */
    }

    componentWillMount() {
        // Faz um GET no endpoint que retorna os equipamentos paginados
        const BASE_URL = 'http://localhost:8080/equipamentos'

        fetch(`${BASE_URL}/page`)
        .then(response => response.json())
        .then(data => this.setState({equipamentos: data.content}));
    }

    onChangePage(pageOfItems) {
        this.setState({pageOfItems: pageOfItems})
    }

    handleSearch(event) {
        this.setState({termo: event.target.value})
    }

    render() {
        // Pega o estado do componente e usa pra recuperar os dados do backend
        const {equipamentos, termo} = this.state;
        equipamentos && console.log(equipamentos)

        return (
            <div>
                <div role='form' className='todoForm'>
                    <div className='col-xs-12 col-sm-9 col-md-10'>
                        <input id='description' className='form-control'
                            placeholder='Pesquise um equipamento'
                            onChange={this.handleSearch}
                            value={termo}
                        />
                    </div>
                </div>

                <table className='table'>
                    <thead>
                        <th>R12</th>
                        <th>Nome</th>
                        <th>Fabricante</th>
                        <th>Descrição</th>
                        <th>Status</th>
                        <th>Data</th>

                    </thead>

                    <tbody className="container">
                        {this.state.pageOfItems.filter(searchingFor(termo)).map(item =>
                            <tr key={item.id}>
                                <td>{item.r12}</td>
                                <td>{item.nome}</td>
                                <td>{item.fabricante}</td>
                                <td>{item.descricao}</td>
                                <td>{item.status}</td>
                                <td>{item.dataUltimaEdicao}</td>
                            </tr>
                        )}
                        <Pagination items={this.state.equipamentos} onChangePage={this.onChangePage} />
                    </tbody> 
                    
                </table>
            </div>
        );
    }
}

export default ConsultaPaginado