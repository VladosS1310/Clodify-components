import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'reactstrap';
import WorkHistoryFilterForm from './WorkHistoryFilterForm/WorkHistoryFilterForm';
import { useNavigate, useParams } from 'react-router-dom';
import { getUsersFetchingAction } from '../../../../../redux/actions/workHistoryActions';
import { useDispatch, useSelector } from 'react-redux';
import { columns } from './DataWorkHistoryColumns';
import DataReactTable from '../../../../Tables/DataTable/components/DataReactTable';
import moment from 'moment';
import _ from 'lodash';
import { getUser } from '../../../../../utils/api';


const WorkHistory = () => {
  const { workHistory, errors, totalRecords } = useSelector(state => state.workHistory);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const fromDate = moment(new Date(new Date().getFullYear(), new Date().getMonth(), 1)).format("YYYY-MM-DD");
  const toDate = moment(new Date()).format("YYYY-MM-DD");
  const [query, setQuery] = useState({ });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [nameUser, setNameUser] = useState('');

  useEffect(() => {
    setQuery((prevState) => {
      return {
        ...prevState,
        from_date: fromDate,
        to_date: toDate,
        start: (currentPage - 1) * pageLimit,
        limit: pageLimit,
      };
    });
  }, [currentPage, pageLimit, fromDate, toDate]);

  useEffect(() => {
    if (_.isEmpty(query)) return;

    dispatch(getUsersFetchingAction(params.id, query));
  }, [dispatch, params.id, query]);

  useEffect(() => {
    getUser(params.id).then(res => {
      if(res.data.success) {
        setNameUser(`${res.data.data.first_name} ${res.data.data.last_name}`)
      }
    })
  }, [params.id])

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangePageSize = (newSize) => {
    setCurrentPage(1);
    setPageLimit(newSize);
  };

  const resetFilterForm = () => {
    return setQuery({...query, from_date: fromDate, to_date: toDate});
  }

  const workHistoryFilter = (value) => {
    return setQuery({...query, from_date: moment(value?.date_start).format('YYYY-MM-DD'), to_date: moment(value?.date_end).format('YYYY-MM-DD')});
  }

  return (
    <Container>
      <Row>
        <Col className="col-12 d-flex justify-content-end">
          <button className="btn btn-success" onClick={() => navigate(`/dashboard/users/${params.id}/work-history/add`)}>Create Work History</button>
        </Col>
        <Col className="col-12">
          <WorkHistoryFilterForm
            onSubmit={workHistoryFilter}
            resetForm={resetFilterForm}
          />
        </Col>
        <Col className="col-12">
          <DataReactTable
            tableName={`Work History of ${nameUser}`}
            sortTable={true}
            search={false}
            pagination={{
              onChangePageSize: handleChangePageSize,
              onChangePage: handleChangePage,
              currentPage,
              totalRecords,
              pageLimit,
            }}
            reactTableData={{
              tableHeaderData: columns, tableRowsData: workHistory
            }}
          />

          {
            errors ? (<div>{errors}</div>) : null
          }
        </Col>
      </Row>
    </Container>
  );
};

export default WorkHistory;