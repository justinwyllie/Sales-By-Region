import {Component as ReactComponent, Fragment} from '@wordpress/element';
import {mockData} from '../../mockData';

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
        const storeCurrency = new Currency(storeCurrencySetting);
        this.state = {
            dateQuery: dateQuery,
            currency: storeCurrency,
            allCountries: [],
            data: { loading: true }
        };
        this.fetchData(this.state.dateQuery);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.getQueryParameters = this.getQueryParameters.bind(this);
        this.prepareData = this.prepareData.bind(this);
        this.getOrdersWithCountries = this.getOrdersWithCountries.bind(this);
        this.getTotalNumber = this.getTotalNumber.bind(this);
        

        
    }

    fetchData(dateQuery) {
        if(!this.state.data.loading) this.setState({data: {loading: true}});
        const endPoints = {
            'countries': '/wc/v3/data/countries?_fields=code,name',
            'orders': '/wc-analytics/reports/orders?_fields=order_id,date_created,date_created_gmt,customer_id,total_sales',
            'customers': '/wc-analytics/reports/customers?_fields=id,country'
        };
        const queryParameters = this.getQueryParameters(dateQuery);
        const countriesPath = endPoints.countries;
        const ordersPath = endPoints.orders + queryParameters;
        const customersPath = endPoints.customers + queryParameters;
        Promise.all([
            this.state.allCountries.length === 0 ? apiFetch({path: countriesPath}) : Promise.resolve(this.state.allCountries),
            apiFetch({path: ordersPath}),
            apiFetch({path: customersPath})
        ])
            .then(([countries, orders, customers]) => {
                console.log("fetched Data", countries, orders, customers);
                const data = this.prepareData(countries, orders, customers);
                console.log("processed Data", data);
                this.setState({data: data, allCountries: countries})
            })
            .catch(err => console.log(err));
            console.log("fetched data", this.state.data);
            console.log("paths", endPoints);
            //test endpoints
            const test1 = "/wc-analytics/reports/orders";
            apiFetch({path: test1}).then((data) =>
                {
                    console.log("test1", data)    
                }
            )
            const test2 = "/wc-analytics/reports/orders/4608";
            apiFetch({path: test2}).then((data) =>
                {
                    console.log("test2", data)    
                }
            )



    }


    getQueryParameters(dateQuery) {
        const afterDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.after, 'start'));
        const beforeDate = encodeURIComponent(appendTimestamp(dateQuery.primaryDate.before, 'end'));
        return `&after=${afterDate}&before=${beforeDate}&interval=day&order=asc&per_page=100&_locale=user`;
    }

    getTotalNumber(data, property) {
        const propertyTotal = data.reduce((accumulator, currentObject) => accumulator + currentObject[property], 0);
        return Math.round(propertyTotal * 100) / 100;
    }

    getOrdersWithCountries(orders, customers, countries) {
        return orders.map(order => {
            order.country_code = customers.find(item => item.id === order.customer_id).country;
            const country = countries.find(item => item.code === order.country_code);
            order.country = country ? country.name : __('Unknown country', 'wc-admin-sales-by-country');
            return order;
        });
    }

    getPerCountryData(ordersWithCountries) {
        console.log("getPerCountryData", ordersWithCountries);
        return ordersWithCountries.reduce((accumulator, currentObject) => {
            const countryCode = currentObject['country_code'];
            if (!accumulator.countries) accumulator.countries = [];
            if (!accumulator.countries.find(item => item.country_code === countryCode)) {
                const countryObjectTemplate = {
                    'country': currentObject['country'],
                    'country_code': countryCode,
                    'sales': 0,
                    'sales_percentage': 0,
                    'orders': 0,
                    'average_order_value': 0
                };
                accumulator.countries.push(countryObjectTemplate)
            }
            const countryIndexInAccumulator = accumulator.countries.findIndex(item => item.country_code === countryCode);
            accumulator.countries[countryIndexInAccumulator].sales += currentObject.total_sales;
            accumulator.countries[countryIndexInAccumulator].orders++;
            return accumulator;
        }, {});
    }

    prepareData(countries, orders, customers) {
        let data;
        if (orders.length > 0) {
            const ordersWithCountries = this.getOrdersWithCountries(orders, customers, countries);
            data = this.getPerCountryData(ordersWithCountries);
            console.log("data", data);
            data.totals = {
                total_sales: this.getTotalNumber(data.countries, 'sales'),
                orders: this.getTotalNumber(data.countries, 'orders'),
                countries: data.countries.length,
            };
            data.countries = data.countries.map(country => {
                country.sales_percentage = Math.round(country.sales / data.totals.total_sales * 10000) / 100;
                country.average_order_value = country.sales / country.orders;
                return country;
            });
        } else {
            data = {
                countries: [],
                totals: {
                    total_sales: 0,
                    orders: 0,
                    countries: 0
                }
            }
        }
        data.loading = false;
        return data;
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
        if (this.state.data.loading) 
        { 
            return <p>Waiting...</p> 
        }
        else 
        {
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
}