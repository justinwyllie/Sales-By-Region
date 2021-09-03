import {Component as ReactComponent, Fragment} from '@wordpress/element';
import {TableCard} from '@woocommerce/components';
import { ReportFilters,} from '@woocommerce/components';
import {appendTimestamp, getCurrentDates, getDateParamsFromQuery, isoDateFormat} from '@woocommerce/date';
import {default as Currency} from '@woocommerce/currency';
import {CURRENCY as storeCurrencySetting} from '@woocommerce/settings'; 
import apiFetch from '@wordpress/api-fetch';    


class TableDisplay extends ReactComponent {

    componentDidUpdate(prevProps) {
        //crazy check of render here? 

    }    

    render() {

        const tableHeaders = [
            {key: '-', label: '',  isSortable: false, required: true},
            {key: 'uk', label: 'UK', isLeftAligned: true, isSortable: false, required: true},
            {key: 'eu', label: 'EU', isLeftAligned: true, isSortable: false, required: true},
            {key: 'row', label: 'ROW', isLeftAligned: true, isSortable: false, required: true},
        ];

        const tableRows = [
            [{display: 'Goods net (' + this.props.currency + ')'},{display: this.props.sales['uk']['goods'] },
                {display: this.props.sales['eu']['goods']}, {display: this.props.sales['row']['goods']}],
                [{display: 'Shipping (' + this.props.currency + ')'},{display: this.props.sales['uk']['shipping'] },
                {display: this.props.sales['eu']['shipping']}, {display: this.props.sales['row']['shipping']}],
                [{display: 'Total (' + this.props.currency + ')'},{display: this.props.sales['uk']['total'] },
                {display: this.props.sales['eu']['total']}, {display: this.props.sales['row']['total']}],
    
        ];

        return <TableCard 
                    title="Sales Revenue Summary"
                    rows={tableRows}
                    headers={tableHeaders}
                    rowsPerPage={100}
                    totalRows={tableRows.length}>
                </TableCard>


        /*return <table class="salesByRegionData">
             <tr>
                <th></th>
                <th>UK</th>
                <th>EU</th>
                <th>ROW</th>
            </tr>
            <tr>
                <td>Goods net ({this.props.currency})</td>
                <td>{this.props.sales['uk']['goods']}</td>
                <td>{this.props.sales['eu']['goods']}</td>
                <td>{this.props.sales['row']['goods']}</td>
            </tr>
            <tr>
                <td>Shipping ({this.props.currency})</td>
                <td>{this.props.sales['uk']['shipping']}</td>
                <td>{this.props.sales['eu']['shipping']}</td>
                <td>{this.props.sales['row']['shipping']}</td>
            </tr>
            <tr>
                <td>Total ({this.props.currency})</td>
                <td>{this.props.sales['uk']['total']}</td>
                <td>{this.props.sales['eu']['total']}</td>
                <td>{this.props.sales['row']['total']}</td>
            </tr>
        </table>  */ 
    }
}


export class SalesByRegionReport extends ReactComponent {

    constructor(props) {
        super(props);
        const dateQuery = this.createDateQuery(this.props.query);
        const storeCurrency = new Currency(storeCurrencySetting);
        this.state = {
            dateQuery: dateQuery,
            currency: storeCurrency,
            data: { loading: true },
            error: false
        };
        this.fetchData(this.state.dateQuery);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.getQueryParameters = this.getQueryParameters.bind(this);
        this.prepareData = this.prepareData.bind(this);
    }

    fetchData(dateQuery) {

        if(!this.state.data.loading) this.setState({data: {loading: true}});
        const endPoints = {
             'salesByRegion': '/sales-by-region/v1/sales'
        };
        const queryParameters = this.getQueryParameters(dateQuery);
        const salesPath = endPoints.salesByRegion + queryParameters;

        apiFetch({path: salesPath}).then((salesData) =>
            {
                
                //why is this not automatic todo
                salesData = JSON.parse(salesData);
                const data = this.prepareData(salesData);
                this.setState({data: data});
                this.setState({error: false});

            }
        )
        .catch( (err) => {
            this.setState({error: true});
            console.log(err);
        })
     }


    getQueryParameters(dateQuery) {
        const afterDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.after, 'start'));
        const beforeDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.before, 'end'));
        return `/${afterDate}/${beforeDate}`;
    }

 
    prepareData(salesData) {
        let data;
        data = {sales: salesData};
        data.loading = false;
        return data;
    }

    createDateQuery(query) {
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        return {period, compare, before, after, primaryDate, secondaryDate};
    }

    handleDateChange(newQuery) {
        const newDateQuery = this.createDateQuery(newQuery);
        this.setState({dateQuery: newDateQuery});
        this.fetchData(newDateQuery);
    }

    render() {
      
        const reportFilters =
            <ReportFilters
                dateQuery={this.state.dateQuery}
                query={this.props.query}
                path={this.props.path}
                currency={this.state.currency}
                isoDateFormat={isoDateFormat}
                onDateSelect={this.handleDateChange}
                />;

        if (this.state.error) 
        { 
             return <p class="salesByRegionError">Sorry. An error has occurred. Please try again later.</p> 
        } 
        else if (this.state.data.loading) 
        {
            return <p>Waiting...</p>    
        }
        else
        {
            return <Fragment>
                {reportFilters}   
                <p>{this.state.data.sales == null ? 'No results for this date range. Please try another date range.' : ''}</p>
                {this.state.data.sales != null &&
                    <TableDisplay currency={storeCurrencySetting.symbol} {...this.state.data}></TableDisplay>}
            </Fragment>
        }
    }
}