//todo remove unused
import {Component as ReactComponent, Fragment} from '@wordpress/element';
import {ChartPlaceholder, ReportFilters, SummaryList, SummaryListPlaceholder, SummaryNumber, TablePlaceholder} 
from '@woocommerce/components';
import {__} from '@wordpress/i18n';
import {appendTimestamp, getCurrentDates, getDateParamsFromQuery, isoDateFormat} from '@woocommerce/date';
import {default as Currency} from '@woocommerce/currency';
import {CURRENCY as storeCurrencySetting} from '@woocommerce/settings'; 
import apiFetch from '@wordpress/api-fetch';     

export class SalesByRegionReport extends ReactComponent {

    constructor(props) {
        super(props);
        const dateQuery = this.createDateQuery(this.props.query);
        console.log("dateQuery", dateQuery);
        console.log("constructor");
        const storeCurrency = new Currency(storeCurrencySetting);
        this.state = {
            dateQuery: dateQuery,
            currency: storeCurrency,
            data: { loading: true }
        };
        this.fetchData(this.state.dateQuery);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.getQueryParameters = this.getQueryParameters.bind(this);
        this.prepareData = this.prepareData.bind(this);
        
    }

    fetchData(dateQuery) {
        console.log("fetching data");
        if(!this.state.data.loading) this.setState({data: {loading: true}});
        const endPoints = {
             'salesByRegion': '/sales-by-region/v1/sales'
        };
        const queryParameters = this.getQueryParameters(dateQuery);
        console.log("queryParameters", queryParameters);
        const salesPath = endPoints.salesByRegion + queryParameters;
        console.log("salesPath",salesPath);

        apiFetch({path: salesPath}).then((salesData) =>
            {
                console.log("salesData1", salesData, typeof salesData);
                //why is this not automatic todo
                salesData = JSON.parse(salesData);
                const data = this.prepareData(salesData);
                this.setState({data: data});

            }
        )
        /*.catch( (error) => {
            //todo test this and actually do something 
            console.log(error);
        })*/
     }


    getQueryParameters(dateQuery) {
        //todo maybe we should append timestamp? but it breaks the query. why? 
        //also check date format dd-mm-yyyy in my tests but this comp. gives yyyy-mm-dd
        //send (YYYY-MM-DD)  for best compatibility with get_posts after and before
        const afterDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.after, 'start'));
        const beforeDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.before, 'end'));
        
        return `/${afterDate}/${beforeDate}`;
    }

 
    prepareData(salesData) {
        console.log("sales is", typeof salesData)
        let data;
        data = {sales: salesData};
        data.loading = false;
        console.log("data2", data);
        return data;
    }

    createDateQuery(query) {
        console.log("query1", query);
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        return {period, compare, before, after, primaryDate, secondaryDate};
    }

    handleDateChange(newQuery) {
        console.log("handleDateChanged"  , this, newQuery);
        const newDateQuery = this.createDateQuery(newQuery);
        this.setState({dateQuery: newDateQuery});
    }

    render() {

        console.log("rendering", "props", this.props,);
        console.log("rendering", "state",this.state);
      
        const reportFilters =
            <ReportFilters
                dateQuery={this.state.dateQuery}
                query={this.props.query}
                path={this.props.path}
                currency={this.state.currency}
                isoDateFormat={isoDateFormat}
                onDateSelect={this.handleDateChange}
                />;

        const {data, currency} = this.state;
        if (this.state.data.loading) 
        { 
            return <p>Waiting...</p> 
        } 
        else
        {
            return <Fragment>
                {reportFilters}   
                <p>{this.state.data.sales == null ? 'No results for this date range. Please try another date range.' : ''}</p>
                <div>
                    <table>
                        <tr>
                            <td></td>
                            <td>UK</td>
                            <td>EU</td>
                            <td>ROW</td>
                        </tr>
                        <tr>
                            <td>Goods net</td>
                            <td>{this.state.data.sales['uk']['goods']}</td>
                            <td>{this.state.data.sales['eu']['goods']}</td>
                            <td>{this.state.data.sales['row']['goods']}</td>
                        </tr>
                        <tr>
                            <td>Shipping</td>
                            <td>{this.state.data.sales['uk']['shipping']}</td>
                            <td>{this.state.data.sales['eu']['shipping']}</td>
                            <td>{this.state.data.sales['row']['shipping']}</td>
                        </tr>
                        <tr>
                            <td>Total</td>
                            <td>{this.state.data.sales['uk']['total']}</td>
                            <td>{this.state.data.sales['eu']['total']}</td>
                            <td>{this.state.data.sales['row']['total']}</td>
                        </tr>
                    </table>
                </div>
            </Fragment>
        }
    }
}