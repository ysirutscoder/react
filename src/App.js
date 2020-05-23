import React, {Component} from 'react';
import './App.css';
import axios from 'axios';
import PropTypes from 'prop-types'


const DEFAULT_QUERY = 'js';
const DEFAULT_HPP = '10';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}&${PARAM_PAGE}`;


class  App extends Component{
  constructor(props){
    super(props);
    this.state={
      results:null,
      searchKey:'',
      error:'',
      searchTerm:DEFAULT_QUERY,
      isLoading:false
    };
    this.onDismiss=this.onDismiss.bind(this);
    this.onSearchChange=this.onSearchChange.bind(this);
    this.setSearchTopStories=this.setSearchTopStories.bind(this);
    this.onSearchSubmit=this.onSearchSubmit.bind(this);
    this.fetchSearch = this.fetchSearch.bind(this);
  }

    setSearchTopStories(result) {
        const { hits, page } = result;
        const { searchKey, results } = this.state;
        const oldHits = results && results[searchKey] ? results[searchKey].hits
            : [];
        const updatedHits = [ ...oldHits,
            ...hits
        ];
        this.setState({
            results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            }
        }); }

  fetchSearch(searchTerm,page=0) {
       axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(result => this.setSearchTopStories(result.data))
            .catch(error => this.setState({ error }));
   }

  onSearchSubmit(event) {
      const{searchTerm}=this.state;
      this.fetchSearch(searchTerm);
      this.setState({ searchKey: searchTerm });
      event.preventDefault();

  }

    onDismiss(id) {
        const { searchKey, results } = this.state; const { hits, page } = results[searchKey];
        const isNotId = item => item.objectID !== id;
        const updatedHits = hits.filter(isNotId);
        this.setState({ results: {
                ...results,
                [searchKey]: { hits: updatedHits, page }
            } });
    }

  onSearchChange(event){
    this.setState({searchTerm:event.target.value})
  }



  componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({ isLoading: true });
        this.fetchSearch(searchTerm);
        this.setState({ searchKey: searchTerm });
   }

  render() {
      const {
          searchTerm,
          results,
          searchKey,
          isLoading
      } = this.state;
      const page = (
          results && results[searchKey] && results[searchKey].page
      ) || 0;
      const list = (
          results &&
          results[searchKey] &&
      results[searchKey].hits ) || [];

      if (!isLoading) {
           return <p>Loading ...</p>;
       }
    return (
        <div className="page">
            <div className="interactions">
              <Search
                  value={searchTerm}
                  onSubmit={this.onSearchSubmit}
                  onChange={this.onSearchChange}
              >Search</Search>
            </div>
              <Table
                list={list}
                onDismiss={this.onDismiss}
            />
            <div className="interactions">
                <Button onClick={() => {this.fetchSearch(searchKey, page + 1);window.scrollTo(0,0)}}>
                    Next Page
                </Button>
            </div>
  </div>
    );
  } }

function Search (props) {
    const { value, onChange,children,onSubmit } = props;
    return (
        <form onSubmit={onSubmit}>
          <input
              type="text"
              value={value}
              onChange={onChange}
          />
            <button type="submit">
                {children}
            </button>
          </form>
    );
}

function Table (props) {
    const { list,  onDismiss} = props;
    return (
    <div className="table">
         {list.map(item =>
            <div key={item.objectID} className="table-row">
              <a href={item.url}>{item.title}</a>
                <p>{item.created_at}</p>
              <Button
                  onClick={()=>onDismiss(item.objectID)}
                  className='button-inline'
              >Delete News</Button>
            </div>
        )}
        </div> );
   }

function Button(props) {

     const { onClick, className, children,} = props;
     return (
         <button
          onClick={onClick}
          className={className}
          type="button"
          >{children}
            </button>
     );

     Button.propTypes ={
         onClick:PropTypes.func,
         className:PropTypes.string,
         children:PropTypes.node,
     };
    Table.propTypes = {
        list: PropTypes.array.isRequired,
        onDismiss: PropTypes.func.isRequired,
    };
    Search.propTypes ={
        value:PropTypes.string,
        onChange:PropTypes.func,
        onSubmit:PropTypes.func,
        children:PropTypes.node,
    }

}



export default App;

export {Button, Table, Search }
