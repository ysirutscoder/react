import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'js';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const url = `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}`;


function isSearched(searchTerm){
  return function(item){
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}

class  App extends Component{
  constructor(props){
    super(props);
    this.state={
      result:null,
      searchTerm:DEFAULT_QUERY,
      isLoading:false
    };
    this.onDismiss=this.onDismiss.bind(this);
    this.onSearchChange=this.onSearchChange.bind(this);
  }

    onDismiss(id) {
        const isNotId = item => item.objectID !== id;
        const updatedHits = this.state.result.hits.filter(isNotId);
        this.setState({
            result: { ...this.state.result, hits: updatedHits }
        }); };
  onSearchChange(event){
    this.setState({searchTerm:event.target.value})
  }
    componentDidMount() {
        const { searchTerm } = this.state;
        this.setState({ isLoading: true });
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setState({ result ,isLoading:false}))
            .catch(error => error);
    }
  render() {
    const { searchTerm, result,isLoading } = this.state;
    if (!result){return null;}
    if (isLoading) {
          return <p>Loading ...</p>;
      }
    return (
        <div className="page">
            <div className="interactions">
              <Search
                  value={searchTerm}
                  onChange={this.onSearchChange}
              >Search</Search>
            </div>
              <Table
                result={result.hits}
                condition={searchTerm}
                onDismiss={this.onDismiss}
            />
  </div>
    );
  } }

function Search (props) {
    const { value, onChange,children } = props;
    return (
        <form>
          {children}
          <input
              type="text" value={value}
              onChange={onChange}
          />
          </form>
    );
}

function Table (props) {
    const { result, condition, onDismiss} = props;
    return (
    <div className="table">
         {result.filter(isSearched(condition)).map(item =>
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
}



export default App;
