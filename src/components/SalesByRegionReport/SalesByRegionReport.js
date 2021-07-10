import {Component as ReactComponent, Fragment} from '@wordpress/element';
import {mockData} from '../../mockData';

import {ChartPlaceholder, ReportFilters, SummaryList, SummaryListPlaceholder, SummaryNumber, TablePlaceholder} 
from '@woocommerce/components';
import {__} from '@wordpress/i18n';
import {appendTimestamp, getCurrentDates, getDateParamsFromQuery, isoDateFormat} from '@woocommerce/date';
import {default as Currency} from '@woocommerce/currency';
import {CURRENCY as storeCurrencySetting} from '@woocommerce/settings';     

export class SalesByRegionReport extends ReactComponent {

    constructor(props) {
        super(props);
        const dateQuery = this.createDateQuery(this.props.query);
        console.log("dateQuery", dateQuery);
        const storeCurrency = new Currency(storeCurrencySetting);
        this.state = {
            dateQuery: dateQuery,
            currency: storeCurrency,
            data: mockData
        }
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    createDateQuery(query) {
        console.log("query1", query);
        const {period, compare, before, after} = getDateParamsFromQuery(query);
        const {primary: primaryDate, secondary: secondaryDate} = getCurrentDates(query);
        return {period, compare, before, after, primaryDate, secondaryDate};
    }

    handleDateChange(newQuery) {
        console.log("debug2"  , this, newQuery);
        const newDateQuery = this.createDateQuery(newQuery);
        this.setState({dateQuery: newDateQuery});
        //this.fetchData(newDateQuery);
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
        return <Fragment>
            {reportFilters}
            <SummaryList>
                {() => [
                    <SummaryNumber key='sales'
                                    value={currency.render(data.totals.total_sales)}
                                    label={__('Total Sales', 'sales-by-region')}/>,
                    <SummaryNumber key='countries'
                                    value={data.totals.countries}
                                    label={__('Countries', 'sales-by-region')}/>,
                    <SummaryNumber key='orders'
                                    value={data.totals.orders}
                                    label={__('Orders', 'sales-by-region')}/>
                ]}
            </SummaryList>
        </Fragment>
    }
}