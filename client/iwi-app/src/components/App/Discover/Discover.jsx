import React from 'react';
import FoundPeopleList from './FoundPeopleList';
import useForms from '../../../hooks/useForms';
import { connect } from 'react-redux';
import { searchUser } from '../../../store/fetcher/userFetcher';
import Loader from '../../Loader/Loader';

function Discover({ search, fetchStatus }) {
    const { handleSubmit, handleChangeInput, inputs } = useForms((e) => {
        search(inputs);
    })
    
    return (
        <main>
            <div>
                <div className="search">
                    <h1>Discover more people</h1>
                    <form id="searchForm" onSubmit={handleSubmit}>
                        <input 
                            type="search" 
                            placeholder="Search..." 
                            name="searchText"
                            value={inputs.searchText || ''}
                            onChange={handleChangeInput}
                        />
                    </form>
                </div>
                {
                    fetchStatus > 0 
                        ? <Loader />
                        : <FoundPeopleList />
                }
            </div>
        </main>
    )
}

function mapStateToProps(state) {
    return {
        fetchStatus: state.fetchStatus,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        search: (data) => dispatch(searchUser(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
